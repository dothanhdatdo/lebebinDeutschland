// Đăng nhập Google + đồng bộ tiến độ lên Firestore (users/{uid})
const cfg = window.FIREBASE_CONFIG;
const V = '10.12.2', base = `https://www.gstatic.com/firebasejs/${V}/`;
const ui = window.CloudUI;
if (!cfg) { ui.set({ enabled: false }); }
else {
  const [{ initializeApp }, A, F] = await Promise.all([
    import(base + 'firebase-app.js'), import(base + 'firebase-auth.js'), import(base + 'firebase-firestore.js')]);
  const app = initializeApp(cfg), auth = A.getAuth(app), db = F.getFirestore(app);
  const provider = new A.GoogleAuthProvider();
  let user = null, timer = null, ready = false;

  const merge = (loc, rem) => {
    const s = { ...(rem.stats || {}) };
    for (const [k, v] of Object.entries(loc.stats || {})) {
      const r = s[k]; if (!r || (v.r + v.w) >= (r.r + r.w)) s[k] = v;
    }
    const ex = (loc.exams || []).length >= (rem.exams || []).length ? loc.exams : rem.exams;
    return { stats: s, exams: ex || [], pos: Math.max(loc.pos || 1, rem.pos || 1) };
  };
  const push = async () => {
    if (!user || !ready) return;
    try {
      await F.setDoc(F.doc(db, 'users', user.uid), { ...ui.getData(), name: user.displayName || '', updatedAt: F.serverTimestamp() });
      ui.set({ user, syncing: false, synced: new Date() });
    } catch (e) { ui.set({ user, error: 'Không lưu được: ' + e.code }); }
  };
  ui.onChange = () => { if (!user) return; ui.set({ user, syncing: true }); clearTimeout(timer); timer = setTimeout(push, 1500); };
  ui.login = async () => {
    try { await A.signInWithPopup(auth, provider); }
    catch (e) { if (e.code === 'auth/popup-blocked' || e.code === 'auth/operation-not-supported-in-this-environment') A.signInWithRedirect(auth, provider); else ui.set({ error: 'Đăng nhập lỗi: ' + e.code }); }
  };
  ui.logout = async () => { clearTimeout(timer); await push(); await A.signOut(auth); ui.setData({}); };

  A.onAuthStateChanged(auth, async u => {
    user = u; ready = false;
    if (!u) { ui.set({ enabled: true, user: null }); return; }
    ui.set({ enabled: true, user: u, syncing: true });
    try {
      const snap = await F.getDoc(F.doc(db, 'users', u.uid));
      const m = merge(ui.getData(), snap.exists() ? snap.data() : {});
      ui.setData(m); ready = true; await push();
    } catch (e) { ui.set({ enabled: true, user: u, error: 'Không tải được dữ liệu: ' + e.code }); }
  });
}
