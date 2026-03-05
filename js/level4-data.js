/* ============================================
   Level 4: SGPANELと統計解析グラフ
   ============================================ */
const LEVEL4_DATA = {
    id: 4,
    title: "SGPANELと統計解析グラフ",
    icon: "📐",
    description: "PROC SGPANELでの多面グラフと統計解析連携グラフを学ぶ",
    modules: [
        {
            id: 401,
            title: "パネルグラフ（5種類）",
            duration: "15分",
            content: `
<h2>パネルグラフ（PROC SGPANEL）</h2>
<p>PROC SGPANELはカテゴリ変数の値ごとにデータを分割し、同じ形式のグラフを<strong>パネル（小グラフの集合）</strong>として一覧表示します。グループ間の比較を直感的に行えるため、探索的データ分析で非常に有用です。</p>

<h3>【グラフ52】パネル棒グラフ SGPANEL VBAR PANELBY</h3>
<p>PANELBY文で指定したカテゴリ変数の値ごとに別々のパネルに棒グラフを表示します。</p>
<pre><code>proc sgpanel data=sashelp.cars;
    panelby origin / layout=panel columns=3;
    vbar type / stat=mean response=mpg_city
        fillattrs=(color=steelblue);
    rowaxis label="平均燃費 (MPG)";
run;</code></pre>

<div class="info-box tip">
<div class="info-box-title">ポイント</div>
<strong>LAYOUT=</strong>オプションでパネルのレイアウトを制御します。
<ul>
<li><strong>PANEL</strong>: 標準的なパネル配置（デフォルト）</li>
<li><strong>LATTICE</strong>: 格子状の配置（行・列を別変数に対応可能）</li>
<li><strong>ROWLATTICE</strong>: 行方向のみの格子配置</li>
<li><strong>COLUMNLATTICE</strong>: 列方向のみの格子配置</li>
</ul>
</div>

<h3>【グラフ53】パネル折れ線 SGPANEL SERIES PANELBY</h3>
<p>時系列データをグループごとにパネル分割して表示します。各グループの傾向を個別に見ながら全体を比較できます。</p>
<pre><code>proc sgpanel data=sashelp.stocks;
    where date >= '01JAN2000'd;
    panelby stock / layout=rowlattice
        uniscale=column;
    series x=date y=close /
        lineattrs=(thickness=2);
    rowaxis label="終値";
run;</code></pre>

<h3>【グラフ54】パネル散布図 SGPANEL SCATTER PANELBY</h3>
<p>カテゴリごとの散布図パネルで変数間の関係をグループ別に比較します。</p>
<pre><code>proc sgpanel data=sashelp.iris;
    panelby Species / columns=3;
    scatter x=PetalLength y=PetalWidth /
        markerattrs=(symbol=circlefilled);
    colaxis label="花弁の長さ";
    rowaxis label="花弁の幅";
run;</code></pre>

<h3>【グラフ55】パネルヒストグラム SGPANEL HISTOGRAM PANELBY</h3>
<p>変数の分布をグループごとに比較します。各パネルに別々のヒストグラムが表示されるため、分布の形状の違いが明確に分かります。</p>
<pre><code>proc sgpanel data=sashelp.cars;
    panelby origin / layout=columnlattice
        uniscale=all;
    histogram mpg_city /
        fillattrs=(color=steelblue transparency=0.3);
    density mpg_city /
        lineattrs=(color=red thickness=2);
    colaxis label="燃費 (MPG)";
run;</code></pre>

<h3>【グラフ56】パネル箱ひげ図 SGPANEL VBOX PANELBY</h3>
<p>複数カテゴリ間の分布比較を箱ひげ図のパネルで表示します。</p>
<pre><code>proc sgpanel data=sashelp.cars;
    panelby origin / layout=panel columns=3;
    vbox mpg_city / category=type
        fillattrs=(color=lightblue);
    rowaxis label="燃費 (MPG)";
run;</code></pre>

<div class="info-box formula">
<div class="info-box-title">主要オプション一覧</div>
<ul>
<li><strong>LAYOUT=PANEL/LATTICE/ROWLATTICE/COLUMNLATTICE</strong>: パネルのレイアウト形式</li>
<li><strong>COLUMNS= / ROWS=</strong>: パネルの列数・行数を明示指定</li>
<li><strong>UNISCALE=ALL/ROW/COLUMN</strong>: 軸スケールの統一範囲を制御</li>
<li><strong>COLAXIS / ROWAXIS</strong>: SGPANELではXAXIS/YAXISの代わりにCOLAXIS/ROWAXISを使用</li>
</ul>
</div>
            `,
            quiz: [
                {
                    id: "q401_1",
                    type: "choice",
                    question: "PROC SGPANELでパネルを分割する変数を指定する文はどれですか？",
                    options: ["GROUPBY", "PANELBY", "SPLITBY", "FACETBY"],
                    answer: 1,
                    explanation: "PANELBY文でパネルを分割するカテゴリ変数を指定します。"
                },
                {
                    id: "q401_2",
                    type: "choice",
                    question: "SGPANELでのX軸設定に使う文はどれですか？",
                    options: ["XAXIS", "COLAXIS", "HAXIS", "PANELAXIS"],
                    answer: 1,
                    explanation: "SGPANELではXAXISの代わりにCOLAXIS、YAXISの代わりにROWAXISを使用します。"
                },
                {
                    id: "q401_3",
                    type: "choice",
                    question: "パネル間で軸スケールを統一するオプションはどれですか？",
                    options: ["SAMESCALE=", "UNISCALE=", "FIXSCALE=", "COMMONSCALE="],
                    answer: 1,
                    explanation: "UNISCALE=オプションでパネル間の軸スケール統一を制御します。ALL, ROW, COLUMNなどが指定できます。"
                },
                {
                    id: "q401_4",
                    type: "fill",
                    question: "SGPANELで行方向のみの格子配置にするLAYOUT=の値は？（英語で）",
                    answer: "ROWLATTICE",
                    explanation: "LAYOUT=ROWLATTICEで行方向のみの格子配置にできます。列方向はCOLUMNLATTICEです。"
                }
            ]
        },
        {
            id: 402,
            title: "回帰・フィッティンググラフ（4種類）",
            duration: "15分",
            content: `
<h2>回帰・フィッティンググラフ</h2>
<p>SGPLOTにはデータへのフィッティング（回帰線の当てはめ）を直接行うプロット文が用意されています。線形回帰、多項式回帰、LOESS（局所回帰）、Bスプラインなど多様な手法が利用できます。</p>

<h3>【グラフ57】線形回帰 REG + CLM/CLI</h3>
<p>REG文は散布図に回帰線を当てはめます。CLMオプションで平均の信頼限界、CLIオプションで個々の予測の信頼限界を表示できます。</p>
<pre><code>proc sgplot data=sashelp.class;
    reg x=height y=weight /
        clm clmtransparency=0.5
        cli clitransparency=0.7
        lineattrs=(color=navy thickness=2)
        legendlabel="線形回帰";
    xaxis label="身長 (インチ)";
    yaxis label="体重 (ポンド)";
    title "身長と体重の線形回帰";
run;</code></pre>

<div class="info-box tip">
<div class="info-box-title">CLMとCLIの違い</div>
<ul>
<li><strong>CLM</strong>（Confidence Limit for Mean）: 回帰線の<strong>平均値の信頼区間</strong>。真の回帰線がこの範囲内にある。</li>
<li><strong>CLI</strong>（Confidence Limit for Individual）: <strong>個々の予測値の信頼区間</strong>。新しい観測値がこの範囲内に入る。CLMより常に広い。</li>
</ul>
</div>

<h3>【グラフ58】多項式回帰 REG DEGREE=2/3</h3>
<p>DEGREE=オプションで多項式の次数を指定して非線形な関係をフィットします。</p>
<pre><code>data curve_data;
    do x = -5 to 5 by 0.2;
        y = 2*x**2 - 3*x + 5 + rannor(42)*5;
        output;
    end;
run;

proc sgplot data=curve_data;
    scatter x=x y=y /
        markerattrs=(symbol=circlefilled size=5 color=gray);
    reg x=x y=y / degree=1
        lineattrs=(color=blue pattern=dash)
        legendlabel="1次（線形）";
    reg x=x y=y / degree=2
        lineattrs=(color=red thickness=2)
        legendlabel="2次（二次曲線）"
        clm;
    reg x=x y=y / degree=3
        lineattrs=(color=green pattern=shortdash)
        legendlabel="3次";
    title "多項式回帰の比較";
run;</code></pre>

<h3>【グラフ59】LOESS+信頼帯 LOESS CLM</h3>
<p>LOESS文は局所回帰（Locally Estimated Scatterplot Smoothing）によるノンパラメトリックなフィッティングを行います。データの局所的なパターンを滑らかに捉えます。</p>
<pre><code>proc sgplot data=sashelp.cars;
    loess x=horsepower y=mpg_city /
        smooth=0.5
        clm
        lineattrs=(color=red thickness=2)
        legendlabel="LOESS";
    scatter x=horsepower y=mpg_city /
        markerattrs=(symbol=circlefilled size=5
                     color=steelblue transparency=0.5);
    xaxis label="馬力";
    yaxis label="燃費 (MPG)";
    title "LOESSによる局所回帰";
run;</code></pre>

<div class="info-box tip">
<div class="info-box-title">ポイント</div>
<strong>SMOOTH=</strong>オプションでLOESSの平滑化パラメータを制御します。値が小さいほどデータに密着し、大きいほど滑らかになります（0〜1の範囲、デフォルト約0.6）。
</div>

<h3>【グラフ60】Bスプライン PBSPLINE CLM</h3>
<p>PBSPLINE文はペナルティ付きBスプラインによるフィッティングを行います。LOESSと同様にノンパラメトリックですが、より滑らかな曲線を生成します。</p>
<pre><code>proc sgplot data=sashelp.cars;
    pbspline x=horsepower y=mpg_city /
        clm
        lineattrs=(color=darkgreen thickness=2)
        legendlabel="Bスプライン";
    scatter x=horsepower y=mpg_city /
        markerattrs=(symbol=circlefilled size=5
                     color=steelblue transparency=0.5);
    xaxis label="馬力";
    yaxis label="燃費 (MPG)";
    title "Bスプラインによるフィッティング";
run;</code></pre>

<div class="info-box formula">
<div class="info-box-title">主要オプション一覧</div>
<ul>
<li><strong>DEGREE=</strong>: REG文の多項式次数（デフォルト1=線形）</li>
<li><strong>SMOOTH=</strong>: LOESS文の平滑化パラメータ（0〜1）</li>
<li><strong>ALPHA=</strong>: 信頼区間の有意水準（デフォルト0.05=95%信頼区間）</li>
<li><strong>CLM</strong>: 平均の信頼限界を表示</li>
<li><strong>CLI</strong>: 個々の予測の信頼限界を表示</li>
</ul>
</div>
            `,
            quiz: [
                {
                    id: "q402_1",
                    type: "choice",
                    question: "REG文のCLMとCLIの関係として正しいものはどれですか？",
                    options: ["CLMの方がCLIより常に広い", "CLIの方がCLMより常に広い", "CLMとCLIは常に同じ幅", "データによって広さの関係が変わる"],
                    answer: 1,
                    explanation: "CLI（個々の予測の信頼区間）はCLM（平均の信頼区間）より常に広くなります。個々の観測値のばらつきが加わるためです。"
                },
                {
                    id: "q402_2",
                    type: "choice",
                    question: "REG文で二次曲線をフィットする場合のオプション指定はどれですか？",
                    options: ["ORDER=2", "DEGREE=2", "POLY=2", "POWER=2"],
                    answer: 1,
                    explanation: "DEGREE=2で二次多項式回帰をフィットします。DEGREE=3なら三次曲線です。"
                },
                {
                    id: "q402_3",
                    type: "choice",
                    question: "LOESS文のSMOOTH=の値を小さくするとどうなりますか？",
                    options: ["曲線がより滑らかになる", "曲線がよりデータに密着する", "信頼区間が狭くなる", "計算速度が上がる"],
                    answer: 1,
                    explanation: "SMOOTH=の値を小さくすると局所的なパターンにより密着した曲線になります。値を大きくすると滑らかになります。"
                },
                {
                    id: "q402_4",
                    type: "fill",
                    question: "ペナルティ付きBスプラインフィッティングを行うSGPLOTの文名は？（英語で）",
                    answer: "PBSPLINE",
                    explanation: "PBSPLINE文はペナルティ付きBスプラインによるノンパラメトリックなフィッティングを行います。"
                }
            ]
        },
        {
            id: 403,
            title: "カプランマイヤーと生存曲線（4種類）",
            duration: "15分",
            content: `
<h2>カプランマイヤーと生存曲線</h2>
<p>生存分析は臨床試験で最も重要な解析手法の一つです。SASでは<strong>PROC LIFETEST</strong>を使ってカプランマイヤー推定を行い、ODS Graphicsで自動的に生存曲線が生成されます。</p>

<h3>【グラフ61】カプランマイヤー曲線 PROC LIFETEST</h3>
<p>カプランマイヤー法はイベント発生までの時間データを分析し、生存率の推定値を段階状の曲線で表示します。</p>
<pre><code>/* サンプルデータ作成 */
data survival;
    input time censor treatment $;
    datalines;
4 1 Drug
7 1 Drug
10 0 Drug
12 1 Drug
15 1 Drug
22 0 Drug
3 1 Placebo
6 1 Placebo
8 1 Placebo
11 0 Placebo
13 1 Placebo
18 1 Placebo
;
run;

ods graphics on;
proc lifetest data=survival
    plots=survival(cb)
    notable;
    time time * censor(0);
    strata treatment;
run;</code></pre>

<div class="info-box tip">
<div class="info-box-title">ポイント</div>
<ul>
<li><strong>TIME文</strong>: time変数 * 打ち切り変数(打ち切り値) の形式で指定</li>
<li><strong>STRATA文</strong>: グループ変数を指定してグループ間の生存曲線を比較</li>
<li><strong>NOTABLE</strong>: 生存率テーブルの出力を抑制</li>
<li><strong>PLOTS=SURVIVAL(CB)</strong>: 信頼帯付きの生存曲線を表示</li>
</ul>
</div>

<h3>【グラフ62】リスク集合テーブル付きKM ATRISK</h3>
<p>生存曲線の下部に各時点のリスク集合（まだイベントが発生していない人数）を表示します。臨床試験論文では標準的な表示形式です。</p>
<pre><code>proc lifetest data=survival
    plots=survival(atrisk cb)
    notable;
    time time * censor(0);
    strata treatment;
run;</code></pre>

<div class="info-box tip">
<div class="info-box-title">ポイント</div>
PLOTS=SURVIVAL(<strong>ATRISK</strong>)を指定するだけで、グラフ下部にリスク集合テーブルが自動追加されます。これは臨床試験の結果報告で必須の要素です。
</div>

<h3>【グラフ63】ハザード関数 PLOTS=HAZARD</h3>
<p>ハザード関数は各時点での瞬間的なイベント発生率を表します。カーネル推定法を用いた滑らかなハザード曲線が得られます。</p>
<pre><code>proc lifetest data=survival
    plots=(survival hazard)
    notable;
    time time * censor(0);
    strata treatment;
run;</code></pre>

<h3>【グラフ64】累積発生率 CIF（Competing Risk）</h3>
<p>競合リスク（複数の種類のイベントが起こりうる場合）の分析では、通常のカプランマイヤー法ではなく累積発生率関数（CIF）を使います。</p>
<pre><code>/* 競合リスクデータ */
data competing;
    input time event_type treatment $;
    /* event_type: 0=打切, 1=主要イベント, 2=競合イベント */
    datalines;
4 1 Drug
7 2 Drug
10 0 Drug
12 1 Drug
15 2 Drug
3 1 Placebo
6 1 Placebo
8 2 Placebo
11 0 Placebo
13 1 Placebo
;
run;

proc lifetest data=competing
    plots=cif(test)
    notable;
    time time * event_type(0) /
        eventcode=1;
    strata treatment;
run;</code></pre>

<div class="info-box formula">
<div class="info-box-title">主要オプション一覧</div>
<ul>
<li><strong>STRATA=</strong>: グループ変数を指定して層別解析</li>
<li><strong>TIME変数 * 打切変数(打切値)</strong>: TIME文の記述形式</li>
<li><strong>OUTSURV=</strong>: 生存率推定値をデータセットに出力</li>
<li><strong>NOTABLE</strong>: 生存率テーブルの出力を抑制</li>
<li><strong>PLOTS=(S H CIF)</strong>: S=生存曲線、H=ハザード、CIF=累積発生率</li>
</ul>
</div>
            `,
            quiz: [
                {
                    id: "q403_1",
                    type: "choice",
                    question: "PROC LIFETESTのTIME文で打ち切り変数を指定する正しい構文はどれですか？",
                    options: ["time * censor(0)", "time censor=0", "time | censor(0)", "time where censor=0"],
                    answer: 0,
                    explanation: "TIME文はtime変数 * 打ち切り変数(打ち切り値)の形式で記述します。括弧内の値が打ち切りを示す値です。"
                },
                {
                    id: "q403_2",
                    type: "choice",
                    question: "カプランマイヤー曲線の下部にリスク集合テーブルを表示するオプションはどれですか？",
                    options: ["RISKTABLE", "ATRISK", "NRISK", "SUBJECTS"],
                    answer: 1,
                    explanation: "PLOTS=SURVIVAL(ATRISK)でリスク集合テーブルが生存曲線の下部に表示されます。"
                },
                {
                    id: "q403_3",
                    type: "choice",
                    question: "競合リスクの分析で使用すべき手法はどれですか？",
                    options: ["標準的なカプランマイヤー法", "累積発生率関数（CIF）", "Cox回帰のみ", "ログランク検定のみ"],
                    answer: 1,
                    explanation: "複数の種類のイベントが起こりうる競合リスクの状況では、通常のカプランマイヤー法ではなく累積発生率関数（CIF）を使います。"
                },
                {
                    id: "q403_4",
                    type: "fill",
                    question: "PROC LIFETESTで生存率テーブルの出力を抑制するオプション名は？（英語で）",
                    answer: "NOTABLE",
                    explanation: "NOTABLEオプションで生存率テーブルの出力を抑制し、グラフのみを出力できます。"
                }
            ]
        },
        {
            id: 404,
            title: "メタアナリシスグラフ（4種類）",
            duration: "15分",
            content: `
<h2>メタアナリシスグラフ</h2>
<p>メタアナリシスは複数の臨床試験の結果を統合して全体的なエビデンスを評価する手法です。SASではSGPLOTの複数プロット文を組み合わせてメタアナリシス特有のグラフを作成できます。</p>

<h3>【グラフ65】フォレストプロット（SCATTER+HIGHLOW+REFLINE）</h3>
<p>フォレストプロットはメタアナリシスの最も代表的なグラフです。各研究の効果推定値と信頼区間を横並びに表示し、統合推定値を菱形で示します。SCATTER文、HIGHLOW文、REFLINE文を組み合わせて作成します。</p>
<pre><code>data forest;
    input study $ or lower upper weight;
    datalines;
Study_A 0.75 0.50 1.12 15
Study_B 0.82 0.61 1.10 22
Study_C 0.68 0.42 1.09 12
Study_D 0.91 0.72 1.15 25
Study_E 0.55 0.33 0.92 10
Overall 0.78 0.66 0.92 .
;
run;

proc sgplot data=forest;
    highlow y=study low=lower high=upper /
        type=line
        lineattrs=(thickness=2 color=darkgray);
    scatter y=study x=or /
        markerattrs=(symbol=squarefilled size=12
                     color=steelblue);
    refline 1 / axis=x
        lineattrs=(pattern=dash color=red)
        label="効果なし";
    xaxis label="オッズ比" type=log
        values=(0.25 0.5 1 2 4);
    yaxis type=discrete discreteorder=data
        label="研究";
    title "フォレストプロット";
run;</code></pre>

<div class="info-box tip">
<div class="info-box-title">ポイント</div>
フォレストプロットでは<strong>REFLINE 1</strong>（オッズ比=1、効果なし）の参照線が重要です。各研究の信頼区間がこの線と交差するかどうかで統計的有意性を視覚的に判断できます。X軸は通常<strong>TYPE=LOG</strong>で対数スケールにします。
</div>

<h3>【グラフ66】ファネルプロット（SCATTER+BAND）</h3>
<p>ファネルプロットは出版バイアスの検出に使われます。各研究の効果量を精度（サンプルサイズや標準誤差）に対してプロットし、漏斗状の境界線を描画します。対称的な分布なら出版バイアスの懸念が低いと判断します。</p>
<pre><code>data funnel;
    input study $ effect se;
    datalines;
A 0.35 0.15
B -0.10 0.25
C 0.42 0.12
D 0.28 0.18
E 0.15 0.30
F 0.50 0.10
G 0.22 0.22
H 0.38 0.14
I -0.05 0.28
J 0.30 0.20
;
run;

data funnel_band;
    set funnel;
    /* ファネルの境界線データ */
    output;
run;

data funnel_boundary;
    overall_effect = 0.28;
    do se = 0.01 to 0.35 by 0.01;
        upper = overall_effect + 1.96 * se;
        lower = overall_effect - 1.96 * se;
        output;
    end;
run;

proc sgplot data=funnel;
    band x=se upper=upper lower=lower /
        data=funnel_boundary
        fillattrs=(color=lightgray transparency=0.5)
        legendlabel="95%疑似信頼区間";
    scatter x=se y=effect /
        markerattrs=(symbol=circlefilled size=10
                     color=steelblue);
    refline 0.28 / axis=y
        lineattrs=(pattern=dash color=red)
        label="統合効果量";
    xaxis label="標準誤差" reverse;
    yaxis label="効果量";
    title "ファネルプロット";
run;</code></pre>

<h3>【グラフ67】L'Abbe プロット</h3>
<p>L'Abbeプロットは各研究の治療群と対照群のイベント率を散布図上にプロットします。対角線より上に点があれば治療群が優位、下にあれば対照群が優位です。</p>
<pre><code>data labbe;
    input study $ ctrl_rate trt_rate weight;
    datalines;
Study_A 0.30 0.20 100
Study_B 0.45 0.35 150
Study_C 0.25 0.10 80
Study_D 0.50 0.42 200
Study_E 0.35 0.18 120
;
run;

proc sgplot data=labbe aspect=1;
    scatter x=ctrl_rate y=trt_rate /
        markerattrs=(symbol=circlefilled color=steelblue)
        datalabel=study;
    lineparm x=0 y=0 slope=1 /
        lineattrs=(pattern=dash color=gray)
        legendlabel="効果なしライン";
    xaxis label="対照群イベント率" min=0 max=0.6;
    yaxis label="治療群イベント率" min=0 max=0.6;
    title "L'Abbe プロット";
run;</code></pre>

<h3>【グラフ68】Galbraith/Radial プロット</h3>
<p>Galbraithプロット（ラジアルプロット）は各研究の精度（1/SE）を横軸、標準化効果量（効果量/SE）を縦軸にプロットします。回帰直線からの乖離度で研究間の異質性を評価します。</p>
<pre><code>data galbraith;
    input study $ effect se;
    precision = 1 / se;
    z_score = effect / se;
    datalines;
A 0.35 0.15
B -0.10 0.25
C 0.42 0.12
D 0.28 0.18
E 0.15 0.30
F 0.50 0.10
G 0.22 0.22
;
run;

proc sgplot data=galbraith;
    scatter x=precision y=z_score /
        markerattrs=(symbol=circlefilled size=10
                     color=steelblue)
        datalabel=study;
    reg x=precision y=z_score /
        nomarkers
        lineattrs=(color=red thickness=2);
    refline 0 / axis=y
        lineattrs=(pattern=dash color=gray);
    refline -2 2 / axis=y
        lineattrs=(pattern=dot color=orange);
    xaxis label="精度 (1/SE)";
    yaxis label="標準化効果量 (Effect/SE)";
    title "Galbraith プロット";
run;</code></pre>

<div class="info-box formula">
<div class="info-box-title">メタアナリシスグラフまとめ</div>
<ul>
<li><strong>フォレストプロット</strong>: オッズ比/リスク比/ハザード比と信頼区間の一覧表示</li>
<li><strong>ファネルプロット</strong>: 出版バイアスの視覚的検出</li>
<li><strong>L'Abbeプロット</strong>: 治療群 vs 対照群のイベント率比較</li>
<li><strong>Galbraithプロット</strong>: 研究間の異質性（ヘテロジニティ）の評価</li>
</ul>
</div>
            `,
            quiz: [
                {
                    id: "q404_1",
                    type: "choice",
                    question: "フォレストプロットでオッズ比=1の参照線が意味するものはどれですか？",
                    options: ["最大効果", "効果なし（帰無仮説）", "最小効果", "統合推定値"],
                    answer: 1,
                    explanation: "オッズ比=1は治療群と対照群で効果に差がないことを意味します。信頼区間がこの線をまたぐ研究は統計的に有意ではありません。"
                },
                {
                    id: "q404_2",
                    type: "choice",
                    question: "ファネルプロットの主な目的はどれですか？",
                    options: ["研究の質の評価", "出版バイアスの検出", "サンプルサイズの計算", "効果量の推定"],
                    answer: 1,
                    explanation: "ファネルプロットは出版バイアスの視覚的検出に使われます。非対称な分布は出版バイアスの存在を示唆します。"
                },
                {
                    id: "q404_3",
                    type: "choice",
                    question: "L'Abbeプロットで対角線より上に点がある場合、何を意味しますか？",
                    options: ["対照群が優位", "治療群が優位", "効果なし", "異質性が高い"],
                    answer: 1,
                    explanation: "L'Abbeプロットで対角線（効果なしライン）より上にある点は、治療群のイベント率が対照群より低く、治療群が優位であることを示します。"
                },
                {
                    id: "q404_4",
                    type: "fill",
                    question: "フォレストプロットのX軸は通常どのスケールで表示しますか？（日本語で）",
                    answer: "対数スケール",
                    explanation: "オッズ比やリスク比は対数スケール（TYPE=LOG）で表示するのが標準です。これにより効果の比率が対称的に表現されます。"
                }
            ]
        }
    ]
};