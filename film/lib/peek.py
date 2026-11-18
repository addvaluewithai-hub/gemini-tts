"""PEEK, built in Blender from code. One function builds him; rig.pose(...) acts him.

Design (brand/peek): a small pink alien spy. Pear-shaped head (small skull, huge cheeks), small blue heavy-lidded
eyes set wide, a round nose bump, two big front teeth, a black wide-brim felt hat with a pink band and a PRESS card,
two pink ball-tipped antennae through the hat, a belted beige trench coat, a red tie, black shoes.
About 1.1 m to the top of the hat. Origin between his feet, facing -Y.
"""
import math
from types import SimpleNamespace

import bpy
import numpy as np
from mathutils import Vector, Euler, Matrix
from scipy.interpolate import PchipInterpolator

from . import kit
from .kit import srgb, material, add_mod, bake, empty, link

# ---- proportions
NECK_Z = 0.585                  # neck pivot above the feet
HEAD_C = 0.20                   # head centre above the neck pivot
HEAD_RX, HEAD_RY, HEAD_TOP, HEAD_BOT = 0.315, 0.285, 0.27, 0.215
EYE_R = 0.068
EYE_DIR = (0.37, -0.93, 0.16)
MOUTH = (0.0, -0.250, -0.1075)  # mouth centre in head space (on the surface, a little inside)
SHOULDER = (0.2, 0.0, 0.485)
ARM_L = 0.135                   # upper arm = forearm
HIP = (0.09, 0.0, 0.2)
COAT_SY = 0.86
COAT_PROFILE = [(0.288, 0.105), (0.283, 0.16), (0.268, 0.23), (0.247, 0.30), (0.236, 0.38), (0.226, 0.45),
                (0.205, 0.51), (0.165, 0.555), (0.118, 0.59), (0.085, 0.615)]


def _resample(profile, n=60):
    p = np.asarray(profile, float)
    d = np.concatenate([[0], np.cumsum(np.linalg.norm(np.diff(p, axis=0), axis=1))])
    t = np.linspace(0, d[-1], n)
    return np.stack([PchipInterpolator(d, p[:, 0])(t), PchipInterpolator(d, p[:, 1])(t)], axis=1)


_coat_r = PchipInterpolator([z for _, z in COAT_PROFILE], [r for r, _ in COAT_PROFILE])


def coat_pt(theta, z, off=0.0):
    """A point on the coat: theta 0 = front, positive toward +X; `off` pushes it outward."""
    r = float(_coat_r(z)) + off
    return Vector((r * math.sin(theta), -r * math.cos(theta) * COAT_SY, z))


def head_shape(P):
    """Unit-sphere directions -> the pear head (head space, centre at the origin)."""
    P = np.asarray(P, float)
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    rs = np.sqrt(np.clip(1 - z * z, 1e-12, None))
    n = 2.7
    rl = np.clip(1 - np.abs(z) ** n, 0, None) ** (1 / n)
    rho = np.where(z < 0, rl, rs)
    s = 0.80 - 0.20 * np.tanh(2.6 * (z - 0.12))
    out = np.stack([x / rs * rho * s * HEAD_RX, y / rs * rho * s * HEAD_RY, np.where(z > 0, z * HEAD_TOP, z * HEAD_BOT)], axis=1)

    def bump(c, amp, sig):
        c = np.array(c, float)
        c /= np.linalg.norm(c)
        d = np.arccos(np.clip(P @ c, -1, 1))
        return amp * np.exp(-(d / sig) ** 2)

    disp = (bump((0.72, -0.5, -0.38), 0.024, 0.42) + bump((-0.72, -0.5, -0.38), 0.024, 0.42)   # cheeks
            + bump((0, -1, -0.13), 0.060, 0.082) + bump((0, -1, -0.13), 0.012, 0.2)              # nose ball
            - bump((EYE_DIR[0], EYE_DIR[1], EYE_DIR[2]), 0.012, 0.2) - bump((-EYE_DIR[0], EYE_DIR[1], EYE_DIR[2]), 0.012, 0.2)
            + bump((0, -1, -0.62), 0.008, 0.25))                                               # chin fullness
    return out + P * disp[:, None]


def head_point(direction):
    d = np.array(direction, float)
    d /= np.linalg.norm(d)
    return Vector(head_shape(d[None])[0]), Vector(d)


# ------------------------------------------------------------------ materials
def _materials():
    M = SimpleNamespace()
    M.skin = material("peek.skin", Base_Color=srgb("#ff4d9f"), Roughness=0.4, Subsurface_Weight=0.85,
                      Subsurface_Radius=(0.6, 0.08, 0.2), Subsurface_Scale=0.018, Coat_Weight=0.1, Coat_Roughness=0.3,
                      Sheen_Weight=0.3, Sheen_Roughness=0.45)
    nt, n, l, b = kit.nodes_of(M.skin)
    # warmer and lighter on top, deeper magenta low and in the creases; soft blotches
    tc = n.new("ShaderNodeTexCoord")
    sep = n.new("ShaderNodeSeparateXYZ")
    l.new(tc.outputs["Object"], sep.inputs[0])
    mr = n.new("ShaderNodeMapRange")
    mr.inputs["From Min"].default_value = -0.22
    mr.inputs["From Max"].default_value = 0.27
    l.new(sep.outputs["Z"], mr.inputs["Value"])
    ramp = n.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].color = srgb("#e81f80")
    ramp.color_ramp.elements[1].color = srgb("#ff479c")
    l.new(mr.outputs["Result"], ramp.inputs["Fac"])
    blot = n.new("ShaderNodeTexNoise")
    blot.inputs["Scale"].default_value = 9.0
    blot.inputs["Detail"].default_value = 3.0
    l.new(tc.outputs["Object"], blot.inputs["Vector"])
    mix = n.new("ShaderNodeMix")
    mix.data_type = "RGBA"
    mix.blend_type = "MULTIPLY"
    mix.inputs[0].default_value = 0.22
    l.new(ramp.outputs["Color"], mix.inputs[6])
    l.new(blot.outputs["Color"], mix.inputs[7])
    l.new(mix.outputs[2], b.inputs["Base Color"])
    kit.add_bump(M.skin, scale=700, strength=0.06, distance=0.0006, roughness_vary=0.07)

    M.lid = material("peek.lid", Base_Color=srgb("#c81f72"), Roughness=0.42, Subsurface_Weight=0.85,
                     Subsurface_Radius=(0.6, 0.08, 0.2), Subsurface_Scale=0.015, Sheen_Weight=0.3)
    M.line = material("peek.line", Base_Color=srgb("#7a1447"), Roughness=0.5)
    M.mouth = material("peek.mouth", Base_Color=srgb("#3a0a22"), Roughness=0.55, Subsurface_Weight=0.3,
                       Subsurface_Radius=(0.4, 0.05, 0.1), Subsurface_Scale=0.02)
    M.tongue = material("peek.tongue", Base_Color=srgb("#ff7a9a"), Roughness=0.35, Subsurface_Weight=0.8,
                        Subsurface_Radius=(0.5, 0.2, 0.2), Subsurface_Scale=0.02, Coat_Weight=0.4)
    M.tooth = material("peek.tooth", Base_Color=srgb("#fffcef"), Roughness=0.22, Subsurface_Weight=0.5,
                       Subsurface_Radius=(0.3, 0.25, 0.2), Subsurface_Scale=0.01, Coat_Weight=0.6, Coat_Roughness=0.1)
    M.eye = _eye_material()
    M.felt = material("peek.felt", Base_Color=srgb("#08080b"), Roughness=0.9, Sheen_Weight=0.3, Sheen_Roughness=0.5,
                      Sheen_Tint=srgb("#6a6a88"))
    kit.add_bump(M.felt, scale=1400, strength=0.5, distance=0.0008, detail=6)
    M.band = material("peek.band", Base_Color=srgb("#f01f84"), Roughness=0.35, Sheen_Weight=0.15, Sheen_Roughness=0.3,
                      Anisotropic=0.5)
    kit.add_bump(M.band, scale=900, strength=0.12, distance=0.0004)
    M.coat = _cloth("peek.coat", "#c9a373")
    M.coat2 = _cloth("peek.coat.trim", "#a9814f")
    M.shirt = _cloth("peek.shirt", "#1d2038", weave=1600)
    M.tie = material("peek.tie", Base_Color=srgb("#8a0f20"), Roughness=0.4, Sheen_Weight=0.7, Sheen_Roughness=0.3)
    kit.add_bump(M.tie, scale=1200, strength=0.2, distance=0.0004)
    M.button = material("peek.button", Base_Color=srgb("#3a2414"), Roughness=0.25, Coat_Weight=0.5)
    M.gold = material("peek.gold", Base_Color=srgb("#f2c14e"), Metallic=1.0, Roughness=0.22)
    M.shoe = material("peek.shoe", Base_Color=srgb("#0a0a0d"), Roughness=0.28, Coat_Weight=0.8, Coat_Roughness=0.12)
    kit.add_bump(M.shoe, scale=300, strength=0.05, distance=0.0005)
    M.trouser = _cloth("peek.trouser", "#14151f", weave=1400)
    M.paper = material("peek.paper", Base_Color=srgb("#f3e8cb"), Roughness=0.85)
    kit.add_bump(M.paper, scale=900, strength=0.15, distance=0.0003)
    M.ink = material("peek.ink", Base_Color=srgb("#151517"), Roughness=0.6)
    return M


def _cloth(name, color, weave=1100):
    """Woven cloth: diagonal twill bump, soft sheen, slight colour drift."""
    m = material(name, Base_Color=srgb(color), Roughness=0.8, Sheen_Weight=0.5, Sheen_Roughness=0.5)
    nt, n, l, b = kit.nodes_of(m)
    tc = n.new("ShaderNodeTexCoord")
    wave = n.new("ShaderNodeTexWave")
    wave.wave_type = "BANDS"
    wave.bands_direction = "DIAGONAL"
    wave.inputs["Scale"].default_value = weave
    wave.inputs["Distortion"].default_value = 0.6
    wave.inputs["Detail"].default_value = 1.0
    l.new(tc.outputs["Object"], wave.inputs["Vector"])
    bump = n.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.35
    bump.inputs["Distance"].default_value = 0.0005
    l.new(wave.outputs["Fac"], bump.inputs["Height"])
    l.new(bump.outputs["Normal"], b.inputs["Normal"])
    drift = n.new("ShaderNodeTexNoise")
    drift.inputs["Scale"].default_value = 6.0
    drift.inputs["Detail"].default_value = 4.0
    l.new(tc.outputs["Object"], drift.inputs["Vector"])
    mix = n.new("ShaderNodeMix")
    mix.data_type = "RGBA"
    mix.blend_type = "MULTIPLY"
    mix.inputs[0].default_value = 0.3
    mix.inputs[6].default_value = srgb(color)
    l.new(drift.outputs["Color"], mix.inputs[7])
    l.new(mix.outputs[2], b.inputs["Base Color"])
    return m


def _eye_material():
    """One sphere: pupil, fibrous blue iris with a dark limbal ring, white sclera; wet clear coat. Gaze is -Y."""
    m = material("peek.eye", Roughness=0.25, Coat_Weight=1.0, Coat_Roughness=0.03, Subsurface_Weight=0.25,
                 Subsurface_Radius=(0.3, 0.2, 0.2), Subsurface_Scale=0.01)
    nt, n, l, b = kit.nodes_of(m)
    tc = n.new("ShaderNodeTexCoord")
    sep = n.new("ShaderNodeSeparateXYZ")
    l.new(tc.outputs["Object"], sep.inputs[0])
    comb = n.new("ShaderNodeCombineXYZ")
    l.new(sep.outputs["X"], comb.inputs["X"])
    l.new(sep.outputs["Z"], comb.inputs["Y"])
    length = n.new("ShaderNodeVectorMath")
    length.operation = "LENGTH"
    l.new(comb.outputs[0], length.inputs[0])
    rn = n.new("ShaderNodeMath")
    rn.operation = "DIVIDE"
    rn.inputs[1].default_value = EYE_R
    l.new(length.outputs["Value"], rn.inputs[0])
    ramp = n.new("ShaderNodeValToRGB")
    cr = ramp.color_ramp
    stops = [(0.0, "#020203"), (0.20, "#020203"), (0.225, "#8fd6ff"), (0.36, "#2f8ae6"), (0.47, "#0f4fb0"),
             (0.505, "#06204f"), (0.53, "#f7f4ee"), (1.0, "#e2d3d8")]
    cr.elements[0].position, cr.elements[0].color = stops[0][0], srgb(stops[0][1])
    cr.elements[1].position, cr.elements[1].color = stops[-1][0], srgb(stops[-1][1])
    for pos, col in stops[1:-1]:
        e = cr.elements.new(pos)
        e.color = srgb(col)
    l.new(rn.outputs[0], ramp.inputs["Fac"])
    # radial fibres: noise on the direction round the gaze axis (constant along the radius)
    norm = n.new("ShaderNodeVectorMath")
    norm.operation = "NORMALIZE"
    l.new(comb.outputs[0], norm.inputs[0])
    fib = n.new("ShaderNodeTexNoise")
    fib.inputs["Scale"].default_value = 14.0
    fib.inputs["Detail"].default_value = 3.0
    l.new(norm.outputs["Vector"], fib.inputs["Vector"])
    fibramp = n.new("ShaderNodeMapRange")
    fibramp.inputs["To Min"].default_value = 0.55
    fibramp.inputs["To Max"].default_value = 1.35
    l.new(fib.outputs["Fac"], fibramp.inputs["Value"])
    gt = n.new("ShaderNodeMath"); gt.operation = "GREATER_THAN"; gt.inputs[1].default_value = 0.215
    lt = n.new("ShaderNodeMath"); lt.operation = "LESS_THAN"; lt.inputs[1].default_value = 0.5
    l.new(rn.outputs[0], gt.inputs[0]); l.new(rn.outputs[0], lt.inputs[0])
    mask = n.new("ShaderNodeMath"); mask.operation = "MULTIPLY"
    l.new(gt.outputs[0], mask.inputs[0]); l.new(lt.outputs[0], mask.inputs[1])
    mul = n.new("ShaderNodeMix"); mul.data_type = "RGBA"; mul.blend_type = "MULTIPLY"
    l.new(mask.outputs[0], mul.inputs[0])
    l.new(ramp.outputs["Color"], mul.inputs[6])
    l.new(fibramp.outputs["Result"], mul.inputs[7])
    # the back of the ball is plain sclera
    front = n.new("ShaderNodeMath"); front.operation = "LESS_THAN"; front.inputs[1].default_value = 0.0
    l.new(sep.outputs["Y"], front.inputs[0])
    fb = n.new("ShaderNodeMix"); fb.data_type = "RGBA"
    l.new(front.outputs[0], fb.inputs[0])
    fb.inputs[6].default_value = srgb("#f7f4ee")
    l.new(mul.outputs[2], fb.inputs[7])
    l.new(fb.outputs[2], b.inputs["Base Color"])
    # a little light of its own in the iris so the eyes stay alive in dark scenes
    em = n.new("ShaderNodeMath"); em.operation = "MULTIPLY"; em.inputs[1].default_value = 0.12
    l.new(mask.outputs[0], em.inputs[0])
    l.new(fb.outputs[2], b.inputs["Emission Color"])
    l.new(em.outputs[0], b.inputs["Emission Strength"])
    return m


# ------------------------------------------------------------------ parts
def _deform(o, fn):
    me = o.data
    co = np.empty(len(me.vertices) * 3)
    me.vertices.foreach_get("co", co)
    co = fn(co.reshape(-1, 3))
    me.vertices.foreach_set("co", co.ravel())
    me.update()


def _torus(name, R, r, segs=48, minor=10, arc=2 * math.pi, **kw):
    full = abs(arc - 2 * math.pi) < 1e-6
    nu = segs if full else segs + 1
    verts = []
    for i in range(minor):
        a = 2 * math.pi * i / minor
        for j in range(nu):
            t = arc * j / segs - (0 if full else arc / 2)
            rr = R + r * math.cos(a)
            verts.append((rr * math.sin(t), -rr * math.cos(t), r * math.sin(a)))
    faces = kit.grid_faces(nu, minor, wrap_u=full)
    last = (minor - 1) * nu
    cols = nu if full else nu - 1
    for j in range(cols):
        faces.append((last + j, last + (j + 1) % nu, (j + 1) % nu, j))
    return kit.mesh_obj(name, verts, faces, **kw)


def _mouth_cutter_verts(base, W=0.115, up=0.0035, dn=0.0035, curve=0.018, bend=0.03, depth=0.07):
    u, v, w = base[:, 0], base[:, 1], base[:, 2]
    x = u * W
    k = (x / 0.115) ** 2
    z = np.where(w > 0, w * up, w * dn) + curve * k
    y = v * depth + bend * k * (W / 0.115) ** 0
    return np.stack([x, y, z], axis=1)


def _hand(name, side, mat, parent):
    """A soft cartoon hand: palm, three fat fingers and a thumb, fused by remeshing. Wrist at the origin, fingers -Z."""
    parts = []
    base, faces = kit.uv_sphere(24, 12)

    def blob(radii, loc, rot=(0, 0, 0)):
        R = Euler(rot).to_matrix()
        v = (base * np.array(radii)) @ np.array(R).T + np.array(loc)
        parts.append(v)

    blob((0.05, 0.034, 0.052), (0, 0, -0.045))
    for i, x in enumerate((-0.031, 0.0, 0.031)):
        blob((0.0185, 0.0185, 0.04), (x * 1.05, -0.004, -0.098 - (0.006 if i == 1 else 0)), (0.12, x * 6, 0))
    blob((0.019, 0.019, 0.034), (-side * 0.05, -0.012, -0.05), (0.2, -side * 0.9, 0))
    verts = np.concatenate(parts)
    fs = []
    for i in range(len(parts)):
        off = i * len(base)
        fs += [tuple(a + off for a in f) for f in faces]
    o = kit.mesh_obj(name, verts, fs, parent=parent, mat=mat)
    add_mod(o, "REMESH", mode="VOXEL", voxel_size=0.0035, use_smooth_shade=True)
    add_mod(o, "SMOOTH", factor=0.7, iterations=10)
    bake(o)
    o.data.shade_smooth()
    return o


def _patch(name, fn, nu, nv, thick, mat, parent, subsurf=1):
    """A sheet on the coat: fn(u, v) -> Vector. Solidified, softened."""
    verts = [fn(j / (nu - 1), i / (nv - 1)) for i in range(nv) for j in range(nu)]
    o = kit.mesh_obj(name, verts, kit.grid_faces(nu, nv), parent=parent, mat=mat)
    add_mod(o, "SOLIDIFY", thickness=thick, offset=1.0)
    if subsurf:
        add_mod(o, "SUBSURF", levels=subsurf, render_levels=subsurf)
    bake(o)
    o.data.shade_smooth()
    return o


# ------------------------------------------------------------------ build
def build_peek():
    M = _materials()
    rig = SimpleNamespace(mats=M)
    root = empty("peek")
    body = empty("peek.body", root)
    headc = empty("peek.neck", body, loc=(0, 0, NECK_Z))
    head = empty("peek.headspace", headc, loc=(0, 0, HEAD_C))       # head space: origin at the head centre
    rig.root, rig.body, rig.neck, rig.headspace = root, body, headc, head

    # ---- head, with the mouth cut by a boolean so it is a real opening
    P, faces = kit.uv_sphere(192, 96)
    skull = kit.mesh_obj("peek.head", head_shape(P), faces, parent=head, mat=M.skin)
    base, cfaces = kit.uv_sphere(48, 24)
    cutter = kit.mesh_obj("peek.mouthcut", _mouth_cutter_verts(base), cfaces, parent=head, mat=M.mouth)
    cutter.location = MOUTH
    cutter.hide_render = True
    cutter.display_type = "WIRE"
    cutter.shape_key_add(name="Basis")
    keys = {
        "open": dict(dn=0.075, up=0.008, W=0.1),
        "smile": dict(curve=0.06, W=0.135),
        "frown": dict(curve=-0.04, W=0.11),
        "narrow": dict(W=0.045, curve=0.004, bend=0.006),
        "wide": dict(W=0.15, bend=0.05),
    }
    b0 = _mouth_cutter_verts(base)
    for kname, kw in keys.items():
        kb = cutter.shape_key_add(name=kname)
        kb.data.foreach_set("co", _mouth_cutter_verts(base, **kw).ravel())
        kb.slider_min, kb.slider_max = -1.0, 2.0
    skull.data.materials.append(M.mouth)
    boolean = add_mod(skull, "BOOLEAN", operation="DIFFERENCE", object=cutter, solver="EXACT")
    try:
        boolean.material_mode = "TRANSFER"
    except Exception:
        pass
    rig.cutter = cutter

    teeth = empty("peek.teeth", head, loc=(0, MOUTH[1] - 0.012, MOUTH[2] + 0.004))
    for s in (-1, 1):
        t = kit.box(f"peek.tooth{s}", (0.03, 0.013, 0.04), bevel=0.0055, segments=4, parent=teeth, mat=M.tooth)
        t.location = (s * 0.0162, 0, -0.019)
        t.rotation_euler = (0.1, 0, s * 0.03)
    rig.teeth = teeth
    tongue = kit.ellipsoid("peek.tongue", (0.05, 0.04, 0.016), parent=head, mat=M.tongue)
    tongue.location = (0, MOUTH[1] + 0.035, MOUTH[2] - 0.045)
    rig.tongue = tongue

    # ---- eyes: ball (gaze), upper and lower lids with a dark rim
    rig.eyes = []
    for s in (-1, 1):
        p, d = head_point((s * EYE_DIR[0], EYE_DIR[1], EYE_DIR[2]))
        socket = empty(f"peek.eye{s}", head, loc=p - d * 0.03)
        socket.rotation_euler = (0, 0, s * math.radians(9))
        ball = kit.ellipsoid(f"peek.eyeball{s}", (EYE_R,) * 3, segs=64, rings=32, parent=socket, mat=M.eye)
        RL = EYE_R * 1.085
        rows = []
        segs, nr = 64, 20
        for i in range(nr):
            t = 0.03 + (math.pi / 2 - 0.03) * i / (nr - 1)
            for j in range(segs):
                a = 2 * math.pi * j / segs
                rows.append((RL * math.sin(t) * math.cos(a), RL * math.sin(t) * math.sin(a), RL * math.cos(t)))
        up = empty(f"peek.lid.up{s}", socket)
        lidm = kit.mesh_obj(f"peek.lidmesh{s}", rows, kit.grid_faces(segs, nr, wrap_u=True), parent=up, mat=M.lid)
        add_mod(lidm, "SOLIDIFY", thickness=0.006, offset=1.0)
        bake(lidm)
        lidm.data.shade_smooth()
        _torus(f"peek.lidrim{s}", RL + 0.003, 0.0042, parent=up, mat=M.line)
        lo = empty(f"peek.lid.lo{s}", socket)
        lowm = kit.mesh_obj(f"peek.lowlid{s}", [(x, y, -z) for x, y, z in rows],
                            [tuple(reversed(f)) for f in kit.grid_faces(segs, nr, wrap_u=True)], parent=lo, mat=M.lid)
        add_mod(lowm, "SOLIDIFY", thickness=0.005, offset=1.0)
        bake(lowm)
        lowm.data.shade_smooth()
        # brow: a thick tapered arc floating just off the skin
        bp, bd = head_point((s * 0.36, -0.93, 0.47))
        brow = kit.tube(f"peek.brow{s}", [(-0.062, 0.012, -0.008), (0, -0.006, 0.012), (0.062, 0.012, -0.006)], 0.0125,
                        radii=[0.55, 1.0, 0.6] if s < 0 else [0.6, 1.0, 0.55], parent=head, mat=M.line)
        brow.location = bp + bd * 0.012
        rig.eyes.append(SimpleNamespace(side=s, socket=socket, ball=ball, up=up, lo=lo, brow=brow, brow_home=brow.location.copy()))

    # freckle spots at the temples (as in the drawings)
    for dx, dz in ((0.80, 0.30), (0.86, 0.22), (-0.82, 0.27)):
        p, d = head_point((dx, -0.55, dz))
        f = kit.ellipsoid("peek.freckle", (0.007, 0.007, 0.007), segs=12, rings=6, parent=head, mat=M.lid)
        f.location = p - d * 0.0035

    # ---- hat
    hat = empty("peek.hat", head, loc=(0, 0.004, 0.142))
    hat.rotation_euler = (math.radians(-5), math.radians(3), 0)
    prof = _resample([(0.150, -0.002), (0.24, -0.010), (0.325, -0.012), (0.372, -0.004), (0.383, 0.006), (0.37, 0.014),
                      (0.31, 0.008), (0.235, 0.010), (0.205, 0.018), (0.197, 0.04), (0.192, 0.10), (0.184, 0.15),
                      (0.166, 0.186), (0.125, 0.205), (0.06, 0.212), (0.0005, 0.213)], 90)
    felt = kit.lathe("peek.hat.felt", prof, segs=128, parent=hat, mat=M.felt)

    def brim_wave(co):
        r = np.hypot(co[:, 0], co[:, 1])
        th = np.arctan2(co[:, 0], -co[:, 1])
        k = np.clip((r - 0.2) / 0.18, 0, 1) ** 2
        co[:, 2] += k * (0.014 * np.cos(2 * th) + 0.006 * np.sin(3 * th + 0.7)) - k * 0.004
        return co
    _deform(felt, brim_wave)
    kit.lathe("peek.hat.band", [(0.1985, 0.017), (0.2015, 0.021), (0.1965, 0.066), (0.1935, 0.07)], segs=128, parent=hat, mat=M.band)
    ca = math.radians(24)
    card = kit.box("peek.card", (0.088, 0.0016, 0.054), bevel=0.0006, segments=2, parent=hat, mat=M.paper)
    card.location = (0.205 * math.sin(ca), -0.205 * math.cos(ca), 0.062)
    card.rotation_euler = (math.radians(-7), math.radians(-6), ca)
    txt = bpy.data.curves.new("peek.press", "FONT")
    txt.body = "PRESS"
    txt.size = 0.026
    txt.extrude = 0.0003
    txt.offset = 0.0006
    txt.align_x = "CENTER"
    txt.align_y = "CENTER"
    txt.materials.append(M.ink)
    to = link(bpy.data.objects.new("peek.press", txt), card)
    to.location = (0, -0.0011, -0.001)
    to.rotation_euler = (math.radians(90), 0, 0)
    rig.hat = hat
    rig.antennae = []
    for s in (-1, 1):
        base_p = Vector((s * 0.092, 0.01, 0.17))
        pts = [base_p, base_p + Vector((s * 0.035, 0, 0.17)), base_p + Vector((s * 0.085, 0, 0.31))]
        stalk = kit.tube(f"peek.antenna{s}", pts, 0.0115, radii=[1.15, 0.95, 0.85], parent=hat, mat=M.skin)
        ball = kit.ellipsoid(f"peek.antball{s}", (0.039,) * 3, segs=32, rings=16, parent=hat, mat=M.skin)
        ball.location = pts[-1] + Vector((s * 0.008, 0, 0.022))
        rig.antennae.append(SimpleNamespace(side=s, stalk=stalk, ball=ball, base=base_p))

    # ---- coat: a belted trench with skirt folds, lapels, collar, pockets, buttons
    cprof = _resample(COAT_PROFILE, 70)

    def folds(theta, r, z):
        k = np.clip((0.29 - z) / 0.16, 0, 1) ** 1.5
        return r * (1 + k * (0.028 * math.sin(7 * theta + 0.4) + 0.012 * math.sin(13 * theta + 2.0)))
    coat = kit.lathe("peek.coat", cprof, segs=160, sy=COAT_SY, fn=folds, parent=body, mat=M.coat)
    add_mod(coat, "SOLIDIFY", thickness=0.007, offset=-1.0)
    bake(coat)
    coat.data.shade_smooth()
    rig.coat = coat

    def lap(side):
        def fn(u, v):
            z = 0.345 + 0.215 * v
            t_in = 0.02 + 0.42 * v ** 1.6
            w = 0.62 * math.sin(min(v / 0.74, 1.0) * math.pi / 2) ** 1.2
            if v > 0.78:
                w *= 0.72
            return coat_pt(side * (t_in + w * u), z, 0.006 + 0.004 * math.sin(u * math.pi))
        return fn
    for s in (-1, 1):
        _patch(f"peek.lapel{s}", lap(s), 10, 22, 0.006, M.coat, body)

    def shirt(u, v):
        z = 0.36 + 0.2 * v
        t_in = 0.03 + 0.42 * v ** 1.6
        return coat_pt((u * 2 - 1) * t_in, z, 0.002)
    _patch("peek.shirt", shirt, 8, 16, 0.002, M.shirt, body, subsurf=0)

    def tie(u, v):
        z = 0.385 + 0.165 * v
        half = (0.034 - 0.02 * v) if v < 0.82 else 0.03
        return coat_pt((u * 2 - 1) * half / 0.22, z, 0.0055 + 0.004 * math.sin(u * math.pi))
    _patch("peek.tie", tie, 6, 14, 0.004, M.tie, body)

    def collar(u, v):
        t = 0.55 + (2 * math.pi - 1.1) * u
        r = 0.128 + 0.075 * v
        z = 0.553 + 0.05 * v - 0.03 * (abs(u - 0.5) * 2) ** 3 * v
        return Vector((r * math.sin(t), -r * math.cos(t) * COAT_SY, z))
    _patch("peek.collar", collar, 48, 6, 0.007, M.coat, body)

    belt = kit.lathe("peek.belt", [(float(_coat_r(z)) + o, z) for z, o in ((0.262, 0.004), (0.265, 0.0085), (0.31, 0.0085), (0.313, 0.004))],
                     segs=160, sy=COAT_SY, parent=body, mat=M.coat2)
    bz = 0.2875
    bc = coat_pt(0, bz, 0.012)
    for dx, dz, w, h in ((0, 0.027, 0.07, 0.011), (0, -0.027, 0.07, 0.011), (-0.03, 0, 0.011, 0.065), (0.03, 0, 0.011, 0.065)):
        bar = kit.box("peek.buckle", (w, 0.009, h), bevel=0.003, parent=body, mat=M.gold)
        bar.location = bc + Vector((dx, 0, dz))
    prong = kit.box("peek.prong", (0.04, 0.006, 0.006), bevel=0.002, parent=body, mat=M.gold)
    prong.location = bc + Vector((0.008, -0.004, 0))

    def tail(u, v):
        return coat_pt(0.2 + 0.2 * v + 0.0 * u, bz - 0.017 + 0.034 * u - 0.05 * v ** 2, 0.011 + 0.006 * v)
    _patch("peek.belt.tail", tail, 4, 8, 0.004, M.coat2, body)

    for s in (-1, 1):
        for z in (0.365, 0.435):
            p = coat_pt(s * 0.3, z, 0.004)
            nrm = Vector((math.sin(s * 0.3), -math.cos(s * 0.3), 0.12)).normalized()
            btn = kit.ellipsoid("peek.button", (0.0165, 0.0165, 0.006), segs=20, rings=10, parent=body, mat=M.button)
            btn.location = p
            btn.rotation_euler = nrm.to_track_quat("Z", "Y").to_euler()

        def pocket(u, v, s=s):
            return coat_pt(s * (0.52 + 0.5 * u), 0.243 - 0.058 * v - 0.012 * u * s * s, 0.012 + 0.004 * math.sin(v * math.pi))
        _patch(f"peek.pocket{s}", pocket, 8, 5, 0.005, M.coat2, body)

    # ---- arms (rubber-hose sleeves), cuffs and hands, posed by hand targets
    rig.arms = []
    for s in (-1, 1):
        sh = Vector((s * SHOULDER[0], SHOULDER[1], SHOULDER[2]))
        sleeve = kit.tube(f"peek.sleeve{s}", [sh, sh + Vector((s * 0.06, 0, -0.12)), sh + Vector((s * 0.08, 0, -0.24))], 0.064,
                          radii=[1.0, 0.93, 0.9], parent=body, mat=M.coat, bevel_res=8)
        wrist = empty(f"peek.wrist{s}", body)
        cuff = _torus(f"peek.cuff{s}", 0.05, 0.016, parent=wrist, mat=M.coat2)
        hand = _hand(f"peek.hand{s}", s, M.skin, wrist)
        hand.location = (0, 0, -0.012)
        rig.arms.append(SimpleNamespace(side=s, shoulder=sh, sleeve=sleeve, wrist=wrist))

    # ---- legs and shoes
    rig.legs = []
    for s in (-1, 1):
        hip = Vector((s * HIP[0], HIP[1], HIP[2]))
        leg = kit.tube(f"peek.leg{s}", [hip, hip + Vector((0, 0, -0.07)), hip + Vector((0.004 * s, 0, -0.14))], 0.05,
                       parent=root, mat=M.trouser)
        foot = empty(f"peek.foot{s}", root, loc=(s * 0.094, 0, 0))
        shoe = kit.ellipsoid(f"peek.shoe{s}", (0.072, 0.118, 0.062), segs=40, rings=20, parent=foot, mat=M.shoe)

        def sole(co):
            co[:, 2] = np.maximum(co[:, 2], -0.03)
            co[:, 2] *= np.where(co[:, 1] > 0, 0.9, 1.0)          # lower heel
            co[:, 0] *= 1 - 0.18 * np.clip(co[:, 1] / 0.118, 0, 1)  # narrower heel
            return co
        _deform(shoe, sole)
        shoe.location = (0, -0.03, 0.03)
        rig.legs.append(SimpleNamespace(side=s, hip=hip, leg=leg, foot=foot))

    rig.pose = lambda **kw: pose(rig, **kw)
    rig.pose()
    return rig


# ------------------------------------------------------------------ acting
DEFAULT = dict(
    lid=0.42, lid_l=None, lid_r=None, low=0.12, gaze=(0.0, 0.0), brow=0.0, brow_tilt=0.0,
    mouth_open=0.0, smile=0.25, narrow=0.0, wide=0.0,
    head=(0.0, 0.0, 0.0), body_rot=(0.0, 0.0, 0.0), body_loc=(0.0, 0.0, 0.0), squash=0.0,
    hand_l=None, hand_r=None, elbow_out=0.6, antenna=(0.0, 0.0), antenna_l=None, antenna_r=None,
    foot_l=None, foot_r=None,
)


def pose(rig, **kw):
    """Set the whole character for the current frame.

    lid 0 wide open .. 1 shut; gaze (x right, y up) in -1..1; brow raise -1..1, brow_tilt +angry/-worried;
    smile -1 frown .. 1 smile; head = (pitch, yaw, roll) radians; hand_l/hand_r = position in body space
    (None = relaxed at the side); antenna = (sideways, forward) bend in radians.
    """
    q = dict(DEFAULT)
    q.update(kw)
    # body
    rig.body.location = q["body_loc"]
    rig.body.rotation_euler = q["body_rot"]
    sq = q["squash"]
    rig.body.scale = (1 + sq * 0.5, 1 + sq * 0.5, 1 - sq)
    rig.neck.rotation_euler = q["head"]
    # eyes
    for e in rig.eyes:
        lid = q["lid_l"] if (e.side < 0 and q["lid_l"] is not None) else q["lid_r"] if (e.side > 0 and q["lid_r"] is not None) else q["lid"]
        e.up.rotation_euler = (math.radians(-60 + 100 * lid), 0, e.side * math.radians(-6 - 10 * max(0, q["brow_tilt"])))
        e.lo.rotation_euler = (math.radians(46 - 40 * q["low"]), 0, 0)
        gx, gy = q["gaze"]
        e.ball.rotation_euler = (math.radians(-22 * gy), 0, math.radians(-28 * gx) - e.side * math.radians(9) * 0.6)
        e.brow.location = e.brow_home + Vector((0, 0, 0.03 * q["brow"]))
        e.brow.rotation_euler = (0, e.side * (0.12 + 0.45 * q["brow_tilt"]), e.side * math.radians(9))
    # mouth
    kb = rig.cutter.data.shape_keys.key_blocks
    sm = q["smile"]
    kb["open"].value = q["mouth_open"]
    kb["smile"].value = max(0.0, sm)
    kb["frown"].value = max(0.0, -sm)
    kb["narrow"].value = q["narrow"]
    kb["wide"].value = q["wide"]
    rig.teeth.location.z = MOUTH[2] + 0.004 + 0.004 * q["mouth_open"]
    rig.tongue.location.z = MOUTH[2] - 0.03 - 0.03 * q["mouth_open"]
    # arms
    for a in rig.arms:
        target = q["hand_l"] if a.side < 0 else q["hand_r"]
        sh = a.shoulder
        w = Vector(target) if target is not None else sh + Vector((a.side * 0.085, -0.01, -0.235))
        d = w - sh
        dist = min(d.length, 2 * ARM_L * 0.995)
        d.normalize()
        w = sh + d * dist
        pole = Vector((a.side * q["elbow_out"], 0.35, -0.3))
        pole = (pole - d * pole.dot(d)).normalized()
        elbow = sh + d * (dist / 2) + pole * math.sqrt(max(ARM_L ** 2 - (dist / 2) ** 2, 0.0))
        kit.set_tube(a.sleeve, [sh, elbow, w])
        a.wrist.location = w
        fore = (w - elbow).normalized()
        a.wrist.rotation_euler = fore.to_track_quat("-Z", "Y").to_euler()
    # legs
    for g in rig.legs:
        ft = q["foot_l"] if g.side < 0 else q["foot_r"]
        if ft is not None:
            g.foot.location = ft[:3]
            g.foot.rotation_euler = (ft[3] if len(ft) > 3 else 0, 0, 0)
        else:
            g.foot.location = (g.side * 0.094, 0, 0)
            g.foot.rotation_euler = (0, 0, g.side * math.radians(-8))
        hipw = Vector(q["body_loc"]) + g.hip
        ankle = Vector(g.foot.location) + Vector((0, 0, 0.055))
        mid = (hipw + ankle) / 2 + Vector((0, -0.02, 0))
        kit.set_tube(g.leg, [hipw, mid, ankle])
    # antennae
    for an in rig.antennae:
        sx, fy = q["antenna_l"] if (an.side < 0 and q["antenna_l"]) else q["antenna_r"] if (an.side > 0 and q["antenna_r"]) else q["antenna"]
        s = an.side
        p0 = an.base
        p1 = p0 + Vector((s * 0.035 + 0.17 * math.sin(sx) * 0.5, -0.17 * math.sin(fy) * 0.5, 0.17))
        p2 = p0 + Vector((s * 0.085 + 0.31 * math.sin(sx), -0.31 * math.sin(fy), 0.31 * math.cos(max(abs(sx), abs(fy)) * 0.8)))
        kit.set_tube(an.stalk, [p0, p1, p2])
        tip_dir = (p2 - p1).normalized()
        an.ball.location = p2 + tip_dir * 0.024
