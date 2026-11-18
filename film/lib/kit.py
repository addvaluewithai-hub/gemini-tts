"""Small Blender (bpy) kit for the Peek films: scene reset, meshes from numpy, lathes, tubes, materials.

Blender runs as a Python module (pip install bpy); Cycles on the CPU with OpenImageDenoise. Z is up, characters
face -Y, units are metres.
"""
import math
import warnings

import bpy
import numpy as np

warnings.filterwarnings("ignore", category=DeprecationWarning)


# ------------------------------------------------------------------ scene
def reset(samples=48, width=720, height=1280, fps=24):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    import addon_utils
    addon_utils.enable("cycles")
    s = bpy.context.scene
    s.render.engine = "CYCLES"
    c = s.cycles
    c.device = "CPU"
    c.samples = samples
    c.use_adaptive_sampling = True
    c.adaptive_threshold = 0.03
    c.use_denoising = True
    c.denoiser = "OPENIMAGEDENOISE"
    c.max_bounces = 6
    c.diffuse_bounces = 3
    c.glossy_bounces = 3
    c.transmission_bounces = 4
    c.volume_bounces = 0
    c.caustics_reflective = False
    c.caustics_refractive = False
    c.sample_clamp_indirect = 6.0
    s.render.use_persistent_data = True
    s.render.resolution_x, s.render.resolution_y = width, height
    s.render.resolution_percentage = 100
    s.render.fps = fps
    s.render.film_transparent = False
    s.view_settings.view_transform = "AgX"
    try:
        s.view_settings.look = "AgX - Medium High Contrast"
    except TypeError:
        pass
    w = bpy.data.worlds.new("world")
    s.world = w
    w.use_nodes = True
    return s


def link(obj, parent=None):
    bpy.context.scene.collection.objects.link(obj)
    if parent is not None:
        obj.parent = parent
    return obj


def empty(name, parent=None, loc=(0, 0, 0)):
    o = bpy.data.objects.new(name, None)
    o.empty_display_size = 0.05
    o.location = loc
    return link(o, parent)


# ------------------------------------------------------------------ colour
def srgb(hexstr, a=1.0):
    h = hexstr.lstrip("#")
    v = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    lin = [x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in v]
    return (*lin, a)


# ------------------------------------------------------------------ meshes
def mesh_obj(name, verts, faces, parent=None, smooth=True, mat=None):
    me = bpy.data.meshes.new(name)
    me.from_pydata([tuple(map(float, v)) for v in verts], [], [tuple(map(int, f)) for f in faces])
    me.update()
    if smooth:
        me.shade_smooth()
    o = bpy.data.objects.new(name, me)
    if mat is not None:
        me.materials.append(mat)
    return link(o, parent)


def uv_sphere(segs=48, rings=24):
    """Unit sphere as (verts[N,3], quad/tri faces). Poles on +-Z."""
    verts = [(0, 0, 1)]
    for i in range(1, rings):
        t = math.pi * i / rings
        for j in range(segs):
            p = 2 * math.pi * j / segs
            verts.append((math.sin(t) * math.cos(p), math.sin(t) * math.sin(p), math.cos(t)))
    verts.append((0, 0, -1))
    faces = []
    for j in range(segs):
        faces.append((0, 1 + j, 1 + (j + 1) % segs))
    for i in range(rings - 2):
        a, b = 1 + i * segs, 1 + (i + 1) * segs
        for j in range(segs):
            faces.append((a + j, b + j, b + (j + 1) % segs, a + (j + 1) % segs))
    last = len(verts) - 1
    a = 1 + (rings - 2) * segs
    for j in range(segs):
        faces.append((last, a + (j + 1) % segs, a + j))
    return np.array(verts, dtype=float), faces


def ellipsoid(name, radii, segs=40, rings=20, **kw):
    v, f = uv_sphere(segs, rings)
    return mesh_obj(name, v * np.array(radii), f, **kw)


def grid_faces(nu, nv, wrap_u=False):
    """Quad faces for a (nv rows) x (nu cols) vertex grid stored row by row."""
    faces = []
    cols = nu if wrap_u else nu - 1
    for i in range(nv - 1):
        for j in range(cols):
            a = i * nu + j
            b = i * nu + (j + 1) % nu
            faces.append((a, b, b + nu, a + nu))
    return faces


def lathe(name, profile, segs=96, sy=1.0, fn=None, uv_scale=1.0, **kw):
    """Revolve (r, z) points round Z. `fn(theta, r, z) -> r` can add folds. Adds a UV map (arc length, z)."""
    prof = np.asarray(profile, dtype=float)
    th = np.linspace(0, 2 * math.pi, segs, endpoint=False)
    rows = []
    for r, z in prof:
        rr = np.full(segs, r) if fn is None else np.array([fn(t, r, z) for t in th])
        rows.append(np.stack([rr * np.sin(th), -rr * np.cos(th) * sy, np.full(segs, z)], axis=1))
    verts = np.concatenate(rows)
    faces = grid_faces(segs, len(prof), wrap_u=True)
    o = mesh_obj(name, verts, faces, **kw)
    uv = o.data.uv_layers.new(name="UVMap")
    rmax = float(prof[:, 0].max())
    for poly in o.data.polygons:
        ths = [th[v % segs] for v in poly.vertices]
        if max(ths) - min(ths) > math.pi:      # the seam face
            ths = [t + 2 * math.pi if t < math.pi else t for t in ths]
        for li, vi, t in zip(poly.loop_indices, poly.vertices, ths):
            uv.data[li].uv = (t * rmax * uv_scale, verts[vi][2] * uv_scale)
    return o


def add_mod(o, kind, **props):
    m = o.modifiers.new(kind.lower(), kind)
    for k, v in props.items():
        setattr(m, k, v)
    return m


def bake(o):
    """Apply the modifier stack: replace the mesh with its evaluated result."""
    dg = bpy.context.evaluated_depsgraph_get()
    me = bpy.data.meshes.new_from_object(o.evaluated_get(dg))
    o.modifiers.clear()
    old = o.data
    o.data = me
    if old.users == 0:
        bpy.data.meshes.remove(old)
    return o


def box(name, size, bevel=0.0, segments=3, **kw):
    sx, sy, sz = [s / 2 for s in size]
    v = [(-sx, -sy, -sz), (sx, -sy, -sz), (sx, sy, -sz), (-sx, sy, -sz), (-sx, -sy, sz), (sx, -sy, sz), (sx, sy, sz), (-sx, sy, sz)]
    f = [(0, 3, 2, 1), (4, 5, 6, 7), (0, 1, 5, 4), (1, 2, 6, 5), (2, 3, 7, 6), (3, 0, 4, 7)]
    o = mesh_obj(name, v, f, smooth=False, **kw)
    if bevel:
        add_mod(o, "BEVEL", width=bevel, segments=segments)
        bake(o)
        o.data.shade_smooth()
    return o


def tube(name, points, radius, radii=None, parent=None, mat=None, resolution=12, bevel_res=6, caps=True):
    """A smooth tube through points (Bezier, auto handles). `radii` scales the radius per point."""
    cu = bpy.data.curves.new(name, "CURVE")
    cu.dimensions = "3D"
    cu.resolution_u = resolution
    cu.bevel_depth = radius
    cu.bevel_resolution = bevel_res
    cu.use_fill_caps = caps
    sp = cu.splines.new("BEZIER")
    sp.bezier_points.add(len(points) - 1)
    for i, p in enumerate(points):
        bp = sp.bezier_points[i]
        bp.co = p
        bp.handle_left_type = bp.handle_right_type = "AUTO"
        bp.radius = 1.0 if radii is None else radii[i]
    o = bpy.data.objects.new(name, cu)
    if mat is not None:
        cu.materials.append(mat)
    return link(o, parent)


def set_tube(o, points, radii=None):
    sp = o.data.splines[0]
    for i, p in enumerate(points):
        sp.bezier_points[i].co = p
        if radii is not None:
            sp.bezier_points[i].radius = radii[i]


# ------------------------------------------------------------------ materials
def material(name, **inputs):
    """Principled material; keyword names are socket names with spaces as underscores (Base_Color=...)."""
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    for k, v in inputs.items():
        b.inputs[k.replace("_", " ")].default_value = v
    return m


def nodes_of(m):
    nt = m.node_tree
    return nt, nt.nodes, nt.links, nt.nodes["Principled BSDF"]


def add_bump(m, scale=400.0, strength=0.15, detail=4.0, distance=0.001, coords="Object", roughness_vary=0.0):
    """Fine noise bump (and optional roughness variation) so nothing looks like plastic."""
    nt, n, l, b = nodes_of(m)
    tc = n.new("ShaderNodeTexCoord")
    noise = n.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = scale
    noise.inputs["Detail"].default_value = detail
    l.new(tc.outputs[coords], noise.inputs["Vector"])
    bump = n.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = strength
    bump.inputs["Distance"].default_value = distance
    l.new(noise.outputs["Fac"], bump.inputs["Height"])
    l.new(bump.outputs["Normal"], b.inputs["Normal"])
    if roughness_vary:
        base = b.inputs["Roughness"].default_value
        mr = n.new("ShaderNodeMapRange")
        mr.inputs["To Min"].default_value = max(0.0, base - roughness_vary)
        mr.inputs["To Max"].default_value = min(1.0, base + roughness_vary)
        big = n.new("ShaderNodeTexNoise")
        big.inputs["Scale"].default_value = scale / 40
        l.new(tc.outputs[coords], big.inputs["Vector"])
        l.new(big.outputs["Fac"], mr.inputs["Value"])
        l.new(mr.outputs["Result"], b.inputs["Roughness"])
    return bump


def emission(name, color, strength=1.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    for nd in list(nt.nodes):
        if nd.type == "BSDF_PRINCIPLED":
            nt.nodes.remove(nd)
    e = nt.nodes.new("ShaderNodeEmission")
    e.inputs["Color"].default_value = color
    e.inputs["Strength"].default_value = strength
    out = next(nd for nd in nt.nodes if nd.type == "OUTPUT_MATERIAL")
    nt.links.new(e.outputs["Emission"], out.inputs["Surface"])
    return m


# ------------------------------------------------------------------ lights and camera
def area_light(name, loc, target, energy, size, color=(1, 1, 1), parent=None, spread=None):
    d = bpy.data.lights.new(name, "AREA")
    d.energy = energy
    d.size = size
    d.color = color[:3]
    if spread is not None:
        d.spread = spread
    o = bpy.data.objects.new(name, d)
    o.location = loc
    look_at(o, target)
    return link(o, parent)


def look_at(o, target, roll=0.0):
    from mathutils import Vector
    d = Vector(target) - Vector(o.location)
    q = d.to_track_quat("-Z", "Y")
    o.rotation_euler = q.to_euler()
    if roll:
        o.rotation_euler.rotate_axis("Z", roll)


def camera(name="cam", lens=50, loc=(0, -4, 1), target=(0, 0, 1), fstop=None, focus=None):
    d = bpy.data.cameras.new(name)
    d.lens = lens
    d.sensor_fit = "VERTICAL"
    d.sensor_height = 36
    o = bpy.data.objects.new(name, d)
    o.location = loc
    look_at(o, target)
    link(o)
    bpy.context.scene.camera = o
    if fstop:
        d.dof.use_dof = True
        d.dof.aperture_fstop = fstop
        from mathutils import Vector
        d.dof.focus_distance = focus if focus else (Vector(target) - Vector(loc)).length
    return o


def render(path):
    s = bpy.context.scene
    s.render.filepath = path
    bpy.ops.render.render(write_still=True)
    return path
