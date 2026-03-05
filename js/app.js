/* ============================================
   SASグラフアカデミー - Main Application
   ============================================ */
const App = {
    levels: [], allModules: [], currentModuleId: null, progress: {}, quizResults: {},

    init() {
        this.levels = [LEVEL1_DATA, LEVEL2_DATA, LEVEL3_DATA, LEVEL4_DATA, LEVEL5_DATA, LEVEL6_DATA];
        this.allModules = [];
        this.levels.forEach(level => { level.modules.forEach(mod => { this.allModules.push({ ...mod, levelId: level.id, levelTitle: level.title }); }); });
        this.loadProgress(); this.buildSidebar(); this.showDashboard();
        if (localStorage.getItem('sas-graph-darkmode') === 'true') document.documentElement.setAttribute('data-theme', 'dark');
        this.updateGlobalProgress();
        document.addEventListener('click', (e) => { const h = e.target.closest('.collapsible-header'); if (h) h.parentElement.classList.toggle('open'); });
    },

    loadProgress() {
        try { const s = localStorage.getItem('sas-graph-progress'); if (s) this.progress = JSON.parse(s);
            const sq = localStorage.getItem('sas-graph-quiz-results'); if (sq) this.quizResults = JSON.parse(sq);
        } catch (e) { this.progress = {}; this.quizResults = {}; }
    },

    saveProgress() { localStorage.setItem('sas-graph-progress', JSON.stringify(this.progress)); localStorage.setItem('sas-graph-quiz-results', JSON.stringify(this.quizResults)); },
    completeModule(id) { this.progress[id] = { completed: true, completedAt: new Date().toISOString() }; this.saveProgress(); this.buildSidebar(); this.updateGlobalProgress(); },
    saveQuizResult(id, result) { this.quizResults[id] = { ...result, attemptedAt: new Date().toISOString() }; this.saveProgress(); },
    isModuleCompleted(id) { return this.progress[id] && this.progress[id].completed; },

    updateGlobalProgress() {
        const total = this.allModules.length, completed = this.allModules.filter(m => this.isModuleCompleted(m.id)).length;
        const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
        const fill = document.getElementById('globalProgressFill'), text = document.getElementById('globalProgressText');
        if (fill) fill.style.width = pct + '%'; if (text) text.textContent = `${pct}% 完了 (${completed}/${total})`;
    },

    buildSidebar() {
        const nav = document.getElementById('sidebarNav'); let html = '';
        this.levels.forEach(level => {
            const mods = level.modules, done = mods.filter(m => this.isModuleCompleted(m.id)).length;
            const isCurrent = this.currentModuleId && mods.some(m => m.id === this.currentModuleId);
            html += `<div class="sidebar-level"><div class="sidebar-level-header ${isCurrent ? 'expanded' : ''}" onclick="App.toggleLevel(this)">
                <span>${level.icon} Lv${level.id}: ${level.title}</span>
                <span style="display:flex;align-items:center;gap:8px;"><span style="font-size:0.7rem;opacity:0.7;">${done}/${mods.length}</span><span class="chevron">▶</span></span>
                </div><div class="sidebar-modules ${isCurrent ? 'expanded' : ''}">`;
            mods.forEach(mod => {
                html += `<div class="sidebar-item ${this.isModuleCompleted(mod.id)?'completed':''} ${this.currentModuleId===mod.id?'active':''}" onclick="App.showModule(${mod.id})">
                    <span class="status-dot"></span><span>${mod.title}</span></div>`;
            });
            html += '</div></div>';
        });
        nav.innerHTML = html;
    },

    toggleLevel(h) { h.classList.toggle('expanded'); h.nextElementSibling.classList.toggle('expanded'); },
    toggleSidebar() { document.getElementById('sidebar').classList.toggle('open'); },

    showDashboard() {
        this.currentModuleId = null; this.showView('dashboardView'); this.buildSidebar();
        const c = document.getElementById('dashboardView');
        const total = this.allModules.length, done = this.allModules.filter(m => this.isModuleCompleted(m.id)).length;
        const quizzes = Object.keys(this.quizResults).length;
        const avg = quizzes > 0 ? Math.round(Object.values(this.quizResults).reduce((s, r) => s + r.percentage, 0) / quizzes) : 0;
        let html = `<div class="fade-in"><div class="dashboard-hero"><h2>SASグラフアカデミーへようこそ</h2>
            <p>PROC SGPLOT、SGPANEL、SGSCATTERからGTL（Graph Template Language）まで、100種類のSASグラフをSASコード付きで体系的に学べる総合学習プラットフォームです。臨床試験グラフも完全網羅。</p></div>
            <div class="dashboard-grid">
                <div class="stat-card"><div class="stat-value">${done}/${total}</div><div class="stat-label">モジュール完了</div></div>
                <div class="stat-card"><div class="stat-value">${quizzes}</div><div class="stat-label">クイズ受験数</div></div>
                <div class="stat-card"><div class="stat-value">${avg}%</div><div class="stat-label">平均スコア</div></div>
                <div class="stat-card"><div class="stat-value">${this.getEstimatedTime()}</div><div class="stat-label">残り学習時間</div></div>
            </div><h2 style="margin-bottom:20px;font-size:1.3rem;">学習コース</h2><div class="dashboard-grid">`;
        this.levels.forEach(level => {
            const mods = level.modules, d = mods.filter(m => this.isModuleCompleted(m.id)).length, pct = Math.round((d / mods.length) * 100);
            html += `<div class="level-card level-${level.id}" onclick="App.showModule(${mods[0].id})">
                <div class="level-card-header"><div class="level-icon">${level.icon}</div><div><h3>Level ${level.id}: ${level.title}</h3>
                <div class="level-desc">${level.description} (${mods.length}モジュール)</div></div></div>
                <div class="level-progress"><div class="level-progress-bar"><div class="level-progress-fill" style="width:${pct}%"></div></div>
                <div class="level-progress-text">${d}/${mods.length} 完了 (${pct}%)</div></div></div>`;
        });
        html += '</div></div>'; c.innerHTML = html;
    },

    getEstimatedTime() {
        let t = 0; this.allModules.forEach(m => { if (!this.isModuleCompleted(m.id)) { const match = m.duration.match(/(\d+)/); if (match) t += parseInt(match[1]); } });
        if (t === 0) return '完了！'; const h = Math.floor(t / 60), mins = t % 60; return h > 0 ? `約${h}時間${mins}分` : `約${mins}分`;
    },

    showModule(moduleId) {
        const mod = this.allModules.find(m => m.id === moduleId); if (!mod) return;
        this.currentModuleId = moduleId; this.showView('moduleView'); this.buildSidebar();
        document.getElementById('sidebar').classList.remove('open');
        const c = document.getElementById('moduleView'), level = this.levels.find(l => l.id === mod.levelId);
        const idx = this.allModules.findIndex(m => m.id === moduleId);
        const prev = idx > 0 ? this.allModules[idx - 1] : null, next = idx < this.allModules.length - 1 ? this.allModules[idx + 1] : null;
        let html = `<div class="fade-in"><div class="module-header">
            <div class="module-breadcrumb"><a onclick="App.showDashboard()">ダッシュボード</a> / <a onclick="App.showModule(${level.modules[0].id})">Level ${level.id}: ${level.title}</a> / ${mod.title}</div>
            <h1 class="module-title">${mod.title}</h1>
            <div class="module-meta"><span>⏱ ${mod.duration}</span><span>${this.isModuleCompleted(moduleId) ? '✅ 完了済み' : '📖 未完了'}</span></div></div>
            <div class="module-body">${mod.content}</div>
            <div class="module-nav"><div>${prev ? `<button class="btn btn-outline" onclick="App.showModule(${prev.id})">← ${prev.title}</button>` : ''}</div>
            <div style="display:flex;gap:12px;">${mod.quiz && mod.quiz.length > 0
                ? `<button class="btn btn-primary btn-lg" onclick="App.startQuiz(${moduleId})">理解度チェック (${mod.quiz.length}問)</button>`
                : `<button class="btn btn-success btn-lg" onclick="App.completeModule(${moduleId}); App.goToNextModule(${moduleId});">完了して次へ</button>`}</div>
            <div>${next ? `<button class="btn btn-outline" onclick="App.showModule(${next.id})">${next.title} →</button>` : ''}</div></div></div>`;
        c.innerHTML = html; document.querySelector('.content').scrollTop = 0;
    },

    startQuiz(moduleId) { const mod = this.allModules.find(m => m.id === moduleId); if (!mod || !mod.quiz) return; this.showView('quizView'); Quiz.start(moduleId, mod.quiz); },
    goToNextModule(id) { const idx = this.allModules.findIndex(m => m.id === id); if (idx < this.allModules.length - 1) this.showModule(this.allModules[idx + 1].id); else { this.showDashboard(); this.showCompletionMessage(); } },

    showCompletionMessage() {
        document.getElementById('modalContent').innerHTML = `<h2>🎓 おめでとうございます！</h2>
            <div class="score-circle pass" style="font-size:2.5rem;">🏆</div>
            <p>全モジュール完了！100種類のSASグラフをマスターしました。実務で活かしていきましょう！</p>
            <div class="modal-actions"><button class="btn btn-primary" onclick="App.closeModal()">ダッシュボードへ</button></div>`;
        document.getElementById('modalOverlay').style.display = 'flex';
    },

    closeModal() { document.getElementById('modalOverlay').style.display = 'none'; },
    showView(viewId) { ['dashboardView','moduleView','quizView','referenceView'].forEach(id => { document.getElementById(id).style.display = id === viewId ? 'block' : 'none'; }); },
    toggleDarkMode() { const d = document.documentElement.getAttribute('data-theme') === 'dark'; if (d) { document.documentElement.removeAttribute('data-theme'); localStorage.setItem('sas-graph-darkmode','false'); } else { document.documentElement.setAttribute('data-theme','dark'); localStorage.setItem('sas-graph-darkmode','true'); } },
    resetProgress() { if (confirm('全ての学習進捗をリセットしますか？')) { this.progress = {}; this.quizResults = {}; localStorage.removeItem('sas-graph-progress'); localStorage.removeItem('sas-graph-quiz-results'); this.buildSidebar(); this.updateGlobalProgress(); this.showDashboard(); } },

    showReference() {
        this.showView('referenceView'); this.buildSidebar();
        const c = document.getElementById('referenceView');
        const sections = [
            { category: 'PROC/ステートメント', terms: [
                { name: 'PROC SGPLOT', desc: '最も汎用的なグラフ作成プロシジャ。散布図、棒グラフ、折れ線グラフなど多様なグラフを生成' },
                { name: 'PROC SGPANEL', desc: 'パネル（分割）グラフを作成するプロシジャ。分類変数でグラフを自動分割して比較表示' },
                { name: 'PROC SGSCATTER', desc: '散布図行列やグループ別散布図を効率的に作成するプロシジャ' },
                { name: 'PROC SGPIE', desc: '円グラフ・ドーナツグラフを作成するプロシジャ（SAS 9.4M5以降）' },
                { name: 'PROC TEMPLATE', desc: 'GTL（Graph Template Language）を使ったカスタムグラフテンプレートの定義' },
                { name: 'PROC GMAP', desc: '地図グラフを作成する従来型プロシジャ。地理データの可視化に使用' },
                { name: 'ODS GRAPHICS', desc: 'ODSグラフィックスの有効化・設定。出力サイズ、解像度、画像形式を制御' },
                { name: 'ODS LAYOUT', desc: '複数グラフの配置レイアウトを制御。グリッド配置やオーバーレイに対応' },
            ]},
            { category: 'グラフ要素', terms: [
                { name: 'VBAR', desc: '縦棒グラフ。カテゴリ別の度数や統計量を縦方向の棒で表示' },
                { name: 'HBAR', desc: '横棒グラフ。カテゴリ名が長い場合に適した横方向の棒グラフ' },
                { name: 'SERIES', desc: '折れ線グラフ。時系列データやトレンドの表示に最適' },
                { name: 'SCATTER', desc: '散布図。2変数間の関係性を点で表示。回帰直線の追加も可能' },
                { name: 'HISTOGRAM', desc: 'ヒストグラム。連続変数の分布を棒の高さで表現' },
                { name: 'HEATMAP', desc: 'ヒートマップ。2次元データの密度や値を色の濃淡で表現' },
                { name: 'HIGHLOW', desc: '高低グラフ。範囲（最大-最小）を棒やひげで表現。Forest plotにも利用' },
                { name: 'BAND', desc: '帯グラフ。信頼区間や範囲を塗りつぶし領域で表示' },
                { name: 'BUBBLE', desc: 'バブルチャート。散布図に第3変数をバブルサイズで追加表現' },
                { name: 'REG', desc: '回帰直線。散布図に線形回帰フィットを重ねて表示' },
                { name: 'LOESS', desc: 'LOESS平滑化曲線。局所重み付き回帰による非線形トレンド表示' },
                { name: 'PBSPLINE', desc: 'Penalized B-Spline曲線。滑らかなフィッティング曲線の描画' },
                { name: 'VECTOR', desc: 'ベクトル（矢印）プロット。方向や変化を矢印で視覚化' },
                { name: 'POLYGON', desc: 'ポリゴン（多角形）プロット。地図やカスタム図形の描画' },
                { name: 'TEXT', desc: 'テキストプロット。データ点にラベルや注釈テキストを配置' },
            ]},
            { category: 'オプション/属性', terms: [
                { name: 'FILLATTRS', desc: '塗りつぶし属性。色（color）と透明度（transparency）を制御' },
                { name: 'LINEATTRS', desc: '線の属性。色、太さ（thickness）、線種（pattern）を制御' },
                { name: 'MARKERATTRS', desc: 'マーカー属性。記号（symbol）、色、サイズを制御' },
                { name: 'TRANSPARENCY', desc: '透明度。0（不透明）～1（完全透明）で重なりの表現に有効' },
                { name: 'DATALABEL', desc: 'データラベル。棒や点に値を直接表示するオプション' },
                { name: 'RESPONSE', desc: '応答変数。集計する数値変数を指定（VBAR/HBARで使用）' },
                { name: 'GROUP', desc: 'グループ変数。データをカテゴリ別に色分けして表示' },
                { name: 'GROUPDISPLAY', desc: 'グループの表示方法。CLUSTER（並列）、STACK（積み上げ）、OVERLAY（重ね）' },
                { name: 'Y2AXIS', desc: '第2Y軸。異なるスケールの変数を1つのグラフに重ねて表示' },
                { name: 'COLORRESPONSE', desc: '色応答変数。連続値を色のグラデーションで表現（ヒートマップ等）' },
            ]},
            { category: 'GTL用語', terms: [
                { name: 'LAYOUT OVERLAY', desc: '複数プロットを同一領域に重ねて描画するGTLレイアウト' },
                { name: 'LAYOUT LATTICE', desc: '行列形式のグリッドにグラフを配置するGTLレイアウト' },
                { name: 'LAYOUT GRIDDED', desc: '柔軟なグリッド配置のGTLレイアウト。セル結合にも対応' },
                { name: 'LAYOUT DATAPANEL', desc: 'データ駆動型パネルレイアウト。分類変数で自動分割' },
                { name: 'BEGINGRAPH / ENDGRAPH', desc: 'GTLテンプレート定義の開始・終了ステートメント' },
                { name: 'DYNAMIC', desc: 'GTLテンプレートの動的パラメータ。実行時に値を変更可能' },
                { name: 'ENTRY', desc: 'テキストエントリ。タイトルや注釈をGTLレイアウト内に配置' },
            ]},
            { category: 'ODS/出力', terms: [
                { name: 'ODS HTML5', desc: 'HTML5形式でグラフを出力。インタラクティブな表示に対応' },
                { name: 'ODS PDF', desc: 'PDF形式でグラフを出力。印刷品質のベクター出力' },
                { name: 'ODS RTF', desc: 'RTF（Rich Text Format）形式で出力。Word文書への埋め込みに対応' },
                { name: 'ODS LISTING', desc: 'テキストリスト出力。画像ファイル（PNG/SVG等）として保存' },
                { name: 'ODS STYLE', desc: '出力スタイルの指定。グラフの配色テーマを一括制御' },
                { name: 'STYLEATTRS', desc: 'グラフ内でスタイル属性を直接指定。色やマーカーの順序を制御' },
                { name: 'DATTRMAP', desc: 'Discrete Attributes Map。カテゴリ値と色・マーカーの対応を定義' },
                { name: 'ATTRPRIORITY', desc: '属性の優先順位。COLOR/NONE指定でグループ色割り当てを制御' },
            ]}
        ];
        const colors = { 'PROC/ステートメント': '#2563eb', 'グラフ要素': '#7c3aed', 'オプション/属性': '#dc2626', 'GTL用語': '#0891b2', 'ODS/出力': '#059669' };
        let html = `<div class="fade-in"><h1 style="font-size:1.6rem;margin-bottom:8px;">用語リファレンス</h1>
            <p style="color:var(--text-secondary);margin-bottom:24px;">SASグラフに関する重要用語の一覧です。</p>
            <div class="reference-search"><input type="text" id="refSearchInput" placeholder="用語名で検索..." oninput="App.filterReference()"></div>`;
        sections.forEach(s => {
            html += `<div class="ref-domain-section"><h2 style="font-size:1.2rem;margin:24px 0 12px;color:${colors[s.category] || '#333'}">${s.category}</h2><div style="display:grid;gap:8px;">`;
            s.terms.forEach(t => {
                html += `<div class="ref-var-row" data-var="${t.name}" style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:12px 16px;display:flex;align-items:center;gap:16px;border-left:4px solid ${colors[s.category] || '#333'}">
                    <div style="min-width:160px;font-weight:700;font-size:0.95rem;">${t.name}</div><div style="font-size:0.85rem;color:var(--text-secondary)">${t.desc}</div></div>`;
            });
            html += '</div></div>';
        });
        html += '</div>'; c.innerHTML = html;
    },

    filterReference() {
        const q = document.getElementById('refSearchInput').value.toLowerCase().trim();
        document.querySelectorAll('.ref-var-row').forEach(r => { r.style.display = (!q || r.getAttribute('data-var').toLowerCase().includes(q)) ? '' : 'none'; });
    }
};

document.addEventListener('DOMContentLoaded', () => { App.init(); });
