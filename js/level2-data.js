/* ============================================
   Level 2: 分布・統計・比較グラフ
   ============================================ */
const LEVEL2_DATA = {
    id: 2,
    title: "分布・統計・比較グラフ",
    icon: "📈",
    description: "分布の可視化から統計的比較まで、17種類のグラフを学ぶ",
    modules: [
        {
            id: 201,
            title: "ヒストグラムと密度グラフ（5種類）",
            duration: "15分",
            content: `
<h2>分布の可視化</h2>
<p>データの分布を理解することは統計解析の第一歩です。PROC SGPLOTでは<code>HISTOGRAM</code>、<code>DENSITY</code>などのステートメントでデータの分布形状を可視化できます。</p>

<h3>【グラフ18】ヒストグラム HISTOGRAM</h3>
<p>連続変数の度数分布を棒（ビン）で表示します。データの分布形状、中心、ばらつきを一目で把握できます。</p>

<pre><code>proc sgplot data=sashelp.class;
  histogram height;
run;</code></pre>

<h3>【グラフ19】密度曲線 DENSITY</h3>
<p>データの確率密度関数を滑らかな曲線で推定表示します。<code>TYPE=</code>オプションで正規分布（NORMAL）またはカーネル密度（KERNEL）を指定できます。</p>

<pre><code>proc sgplot data=sashelp.class;
  density height / type=normal;
  density height / type=kernel;
run;</code></pre>

<h3>【グラフ20】ヒストグラム＋密度オーバーレイ</h3>
<p>ヒストグラムに密度曲線を重ねることで、実際の分布と理論分布の適合度を視覚的に確認できます。</p>

<pre><code>proc sgplot data=sashelp.class;
  histogram height / scale=proportion;
  density height / type=normal;
  density height / type=kernel;
run;</code></pre>

<div class="info-box tip">
<div class="info-box-title">SCALE=オプション</div>
ヒストグラムに密度曲線を重ねる場合は、<code>SCALE=PROPORTION</code>を指定して縦軸を比率に変換します。これにより密度曲線と同じスケールで比較できます。
</div>

<h3>【グラフ21】フリンジプロット FRINGE</h3>
<p>各データ点の位置を軸上の短い線（フリンジ）として表示します。ヒストグラムや密度曲線と組み合わせることで、個々のデータ点の分布を確認できます。</p>

<pre><code>proc sgplot data=sashelp.class;
  histogram height;
  fringe height;
run;</code></pre>

<h3>【グラフ22】累積分布関数 ECDF</h3>
<p>経験的累積分布関数をプロットします。PROC UNIVARIATEのCDFPLOTを使用して作成します。</p>

<pre><code>proc univariate data=sashelp.class;
  var height;
  cdfplot height / normal(mu=est sigma=est);
run;</code></pre>

<div class="info-box warning">
<div class="info-box-title">注意</div>
ECDFはPROC SGPLOTではなく、PROC UNIVARIATEのCDFPLOTステートメントで作成します。NORMAL()オプションを追加すると理論正規分布との比較が可能です。
</div>

<h2>ヒストグラムの主要オプション</h2>
<table>
<tr><th>オプション</th><th>説明</th><th>例</th></tr>
<tr><td>NBINS=</td><td>ビン（棒）の数を指定</td><td>histogram height / nbins=10</td></tr>
<tr><td>BINWIDTH=</td><td>ビンの幅を指定</td><td>histogram height / binwidth=5</td></tr>
<tr><td>BINSTART=</td><td>最初のビンの開始値</td><td>histogram height / binstart=50</td></tr>
<tr><td>SCALE=</td><td>縦軸のスケール</td><td>count / percent / proportion</td></tr>
<tr><td>FILL</td><td>ビンの塗りつぶし（デフォルトON）</td><td>histogram height / fill</td></tr>
<tr><td>FILLATTRS=</td><td>塗りつぶし属性</td><td>fillattrs=(color=lightblue)</td></tr>
<tr><td>GROUP=</td><td>グループ別に色分け</td><td>histogram height / group=sex</td></tr>
</table>
            `,
            quiz: [
                {
                    id: "q201_1",
                    type: "choice",
                    question: "ヒストグラムに密度曲線を重ねる際、縦軸を合わせるために指定するオプションはどれですか？",
                    options: ["SCALE=COUNT", "SCALE=PERCENT", "SCALE=PROPORTION", "SCALE=DENSITY"],
                    answer: 2,
                    explanation: "SCALE=PROPORTIONを指定すると、ヒストグラムの縦軸が比率になり、密度曲線と同じスケールで比較できます。"
                },
                {
                    id: "q201_2",
                    type: "choice",
                    question: "DENSITYステートメントでカーネル密度推定を指定する方法はどれですか？",
                    options: ["METHOD=KERNEL", "TYPE=KERNEL", "SMOOTH=KERNEL", "ESTIMATE=KERNEL"],
                    answer: 1,
                    explanation: "DENSITYステートメントではTYPE=KERNELでカーネル密度推定を、TYPE=NORMALで正規分布の理論密度を指定します。"
                },
                {
                    id: "q201_3",
                    type: "choice",
                    question: "累積分布関数（ECDF）を作成するプロシジャはどれですか？",
                    options: ["PROC SGPLOT", "PROC SGPANEL", "PROC UNIVARIATE", "PROC FREQ"],
                    answer: 2,
                    explanation: "ECDFはPROC UNIVARIATEのCDFPLOTステートメントで作成します。PROC SGPLOTには直接ECDFを作成するステートメントはありません。"
                },
                {
                    id: "q201_4",
                    type: "fill",
                    question: "各データ点の位置を軸上の短い線として表示するステートメント名は？（アルファベットで）",
                    answer: "FRINGE",
                    explanation: "FRINGEステートメントは各データ点の位置を軸上の短い線（フリンジ）として表示し、データの実際の分布を確認できます。"
                }
            ]
        },
        {
            id: 202,
            title: "箱ひげ図とバイオリン図（5種類）",
            duration: "15分",
            content: `
<h2>箱ひげ図の基本</h2>
<p>箱ひげ図（ボックスプロット）はデータの分布の要約統計量（中央値、四分位数、外れ値）を一目で把握できるグラフです。グループ間の分布比較に最も広く使われています。</p>

<h3>【グラフ23】縦箱ひげ図 VBOX</h3>
<p>最も基本的な箱ひげ図です。カテゴリ別に分布を縦方向に表示します。</p>

<pre><code>proc sgplot data=sashelp.class;
  vbox height / category=sex;
run;</code></pre>

<h3>【グラフ24】横箱ひげ図 HBOX</h3>
<p>横方向に箱ひげ図を表示します。カテゴリ名が長い場合に適しています。</p>

<pre><code>proc sgplot data=sashelp.class;
  hbox height / category=sex;
run;</code></pre>

<h3>【グラフ25】ノッチ付き箱ひげ図 VBOX NOTCH</h3>
<p>ノッチ（くびれ）を追加することで、中央値の信頼区間を視覚的に表現します。2つのグループのノッチが重ならない場合、中央値に統計的に有意な差がある可能性を示唆します。</p>

<pre><code>proc sgplot data=sashelp.class;
  vbox height / category=sex notch;
run;</code></pre>

<h3>【グラフ26】ダイヤモンド＋平均接続 VBOX CONNECT=MEAN</h3>
<p>各カテゴリの平均値をダイヤモンドマークで表示し、CONNECT=MEANで平均値同士を線で結びます。平均値のトレンドを把握できます。</p>

<pre><code>proc sgplot data=sashelp.cars;
  where type in ("Sedan" "SUV" "Sports" "Wagon");
  vbox mpg_city / category=type
    connect=mean meanattrs=(symbol=diamondfilled size=10);
run;</code></pre>

<h3>【グラフ27】バイオリン図</h3>
<p>バイオリン図は箱ひげ図とカーネル密度推定を組み合わせたグラフで、分布の形状をより詳細に表現します。SASではGTL（Graph Template Language）またはマクロを使って作成します。</p>

<pre><code>/* GTLによるバイオリン図の基本的なアプローチ */
/* PROC SGPLOTのBAND+散布図で近似的に作成する例 */
proc sgplot data=sashelp.class;
  vbox height / category=sex spread=proportional;
run;

/* 注: 完全なバイオリン図はLevel 5のGTLモジュールで詳しく扱います */</code></pre>

<div class="info-box tip">
<div class="info-box-title">バイオリン図について</div>
SAS 9.4では標準的なバイオリン図ステートメントは提供されていません。PROC SGPLOTのVBOXに<code>SPREAD=PROPORTIONAL</code>を指定するとデータ点の密度を反映した表示になります。完全なバイオリン図はLevel 5のGTLモジュールで詳しく学びます。
</div>

<h2>箱ひげ図の主要オプション</h2>
<table>
<tr><th>オプション</th><th>説明</th><th>例</th></tr>
<tr><td>CATEGORY=</td><td>カテゴリ変数</td><td>vbox height / category=sex</td></tr>
<tr><td>SPREAD=</td><td>データ点の広がり方</td><td>spread=proportional / dataextreme</td></tr>
<tr><td>OUTLIERATTRS=</td><td>外れ値マーカーの属性</td><td>outlierattrs=(color=red symbol=star)</td></tr>
<tr><td>CAPSHAPE=</td><td>ひげの端の形状</td><td>capshape=serif / line / bracket / none</td></tr>
<tr><td>MEANATTRS=</td><td>平均値マーカーの属性</td><td>meanattrs=(symbol=diamondfilled)</td></tr>
<tr><td>NOTCH</td><td>ノッチ（くびれ）を表示</td><td>vbox height / notch</td></tr>
<tr><td>CONNECT=</td><td>カテゴリ間を線で接続</td><td>connect=mean / median</td></tr>
<tr><td>GROUP=</td><td>グループ別に色分け</td><td>vbox height / category=sex group=age</td></tr>
</table>

<div class="info-box success">
<div class="info-box-title">箱ひげ図の読み方</div>
<ul>
<li><strong>箱の上端:</strong> 第3四分位数（Q3、75パーセンタイル）</li>
<li><strong>箱の中線:</strong> 中央値（Q2、50パーセンタイル）</li>
<li><strong>箱の下端:</strong> 第1四分位数（Q1、25パーセンタイル）</li>
<li><strong>ひげ:</strong> Q1 - 1.5*IQR ～ Q3 + 1.5*IQR の範囲</li>
<li><strong>外れ値:</strong> ひげの外のデータ点</li>
<li><strong>ダイヤモンド:</strong> 平均値（表示する場合）</li>
</ul>
</div>
            `,
            quiz: [
                {
                    id: "q202_1",
                    type: "choice",
                    question: "箱ひげ図でノッチ（くびれ）が重ならないことは何を示唆しますか？",
                    options: ["分散が等しい", "中央値に有意な差がある可能性", "データに外れ値がない", "正規分布に従う"],
                    answer: 1,
                    explanation: "ノッチが重ならない場合、2つのグループの中央値に統計的に有意な差がある可能性を示唆します。"
                },
                {
                    id: "q202_2",
                    type: "choice",
                    question: "各カテゴリの平均値を線で結ぶためのオプションはどれですか？",
                    options: ["LINE=MEAN", "CONNECT=MEAN", "JOIN=MEAN", "LINK=MEAN"],
                    answer: 1,
                    explanation: "CONNECT=MEANオプションで各カテゴリの平均値を線で結びます。CONNECT=MEDIANで中央値を結ぶこともできます。"
                },
                {
                    id: "q202_3",
                    type: "choice",
                    question: "箱ひげ図のひげの端の形状を変更するオプションはどれですか？",
                    options: ["WHISKER=", "CAPSHAPE=", "ENDSTYLE=", "TIPSHAPE="],
                    answer: 1,
                    explanation: "CAPSHAPE=オプションでひげの端の形状を指定します。serif、line、bracket、noneなどの値が使えます。"
                },
                {
                    id: "q202_4",
                    type: "fill",
                    question: "箱ひげ図の「箱」が表す範囲は第1四分位数から第何四分位数まで？（数字1文字）",
                    answer: "3",
                    explanation: "箱は第1四分位数（Q1、25パーセンタイル）から第3四分位数（Q3、75パーセンタイル）の範囲を表します。この範囲はIQR（四分位範囲）とも呼ばれます。"
                }
            ]
        },
        {
            id: 203,
            title: "円グラフとツリーマップ（4種類）",
            duration: "12分",
            content: `
<h2>構成比の可視化</h2>
<p>全体に対する各部分の割合を示すには、円グラフやツリーマップが有効です。SASでは<code>PROC SGPIE</code>で円グラフとドーナツグラフを作成できます。</p>

<h3>【グラフ28】円グラフ PROC SGPIE</h3>
<p>全体に対する各カテゴリの割合を扇形で表示します。</p>

<pre><code>proc sgpie data=sashelp.cars;
  pie type /
    datalabeldisplay=(category percent)
    datalabelattrs=(size=10);
run;</code></pre>

<h3>【グラフ29】ドーナツグラフ PROC SGPIE DONUT</h3>
<p>円グラフの中央をくり抜いたドーナツ型のグラフです。中央に合計値やタイトルを表示できます。</p>

<pre><code>proc sgpie data=sashelp.cars;
  donut type /
    hole=40
    datalabeldisplay=(category percent)
    categorydirection=clockwise;
run;</code></pre>

<h3>【グラフ30】ツリーマップ</h3>
<p>階層構造を持つデータの構成比を矩形の面積で表現します。SASではPROC SGPLOTのHEATMAPPARMを活用するか、SAS Visual Analyticsのツリーマップ機能を使用します。</p>

<pre><code>/* PROC SGPLOTのHEATMAPPARMでツリーマップを近似 */
/* データの事前加工が必要 */
data treemap;
  set sashelp.cars;
  by type;
  /* 各タイプの台数をカウント */
run;

proc sgplot data=sashelp.cars;
  heatmapparm x=type y=origin /
    colorresponse=mpg_city
    colormodel=(lightblue blue darkblue);
run;</code></pre>

<div class="info-box tip">
<div class="info-box-title">ツリーマップについて</div>
完全なツリーマップはSAS Visual Analytics、またはGTL（PROC TEMPLATE）を使って作成します。PROC SGPLOTのHEATMAPPARMはツリーマップに近い表現が可能ですが、自動的な面積配分は行いません。
</div>

<h3>【グラフ31】ワッフルチャート</h3>
<p>100マスのグリッドで割合を表現する直感的なグラフです。HEATMAPPARMステートメントで構築できます。</p>

<pre><code>/* ワッフルチャートのデータ作成 */
data waffle;
  length category $10;
  do row = 1 to 10;
    do col = 1 to 10;
      n + 1;
      if n <= 45 then category = "Type A";
      else if n <= 75 then category = "Type B";
      else category = "Type C";
      output;
    end;
  end;
run;

proc sgplot data=waffle;
  heatmapparm x=col y=row /
    colorgroup=category;
  xaxis display=none;
  yaxis display=none;
run;</code></pre>

<h2>円グラフの主要オプション</h2>
<table>
<tr><th>オプション</th><th>説明</th><th>例</th></tr>
<tr><td>DATALABELDISPLAY=</td><td>ラベルの表示内容</td><td>(category percent count)</td></tr>
<tr><td>CATEGORYDIRECTION=</td><td>カテゴリの描画方向</td><td>clockwise / counterclockwise</td></tr>
<tr><td>HOLE=</td><td>ドーナツの穴の大きさ（%）</td><td>hole=40</td></tr>
<tr><td>STARTANGLE=</td><td>最初のスライスの開始角度</td><td>startangle=90</td></tr>
<tr><td>DATASKIN=</td><td>3D風スキン</td><td>dataskin=gloss / sheen / matte</td></tr>
<tr><td>DATALABELATTRS=</td><td>ラベルのフォント属性</td><td>datalabelattrs=(size=10)</td></tr>
</table>

<div class="info-box warning">
<div class="info-box-title">円グラフの使用上の注意</div>
<ul>
<li>カテゴリが多すぎると（7つ以上）読みにくくなります</li>
<li>類似した割合の比較には棒グラフの方が正確です</li>
<li>時系列の比較には円グラフは不向きです</li>
<li>3D効果やDATASKINは視覚的に歪みを生じるため、厳密な比較にはフラットな表示を推奨します</li>
</ul>
</div>
            `,
            quiz: [
                {
                    id: "q203_1",
                    type: "choice",
                    question: "ドーナツグラフの中央の穴の大きさを指定するオプションはどれですか？",
                    options: ["CENTER=", "HOLE=", "INNER=", "DONUTSIZE="],
                    answer: 1,
                    explanation: "HOLE=オプションでドーナツの穴の大きさを割合（%）で指定します。例: hole=40"
                },
                {
                    id: "q203_2",
                    type: "choice",
                    question: "円グラフでカテゴリの描画方向を時計回りにするオプションはどれですか？",
                    options: ["DIRECTION=CW", "CATEGORYDIRECTION=CLOCKWISE", "ORDER=CLOCKWISE", "ROTATION=CW"],
                    answer: 1,
                    explanation: "CATEGORYDIRECTION=CLOCKWISEで時計回りにカテゴリを描画します。デフォルトはCOUNTERCLOCKWISE（反時計回り）です。"
                },
                {
                    id: "q203_3",
                    type: "choice",
                    question: "ワッフルチャートの作成に主に使用するSGPLOTステートメントはどれですか？",
                    options: ["HEATMAP", "HEATMAPPARM", "BLOCK", "TILE"],
                    answer: 1,
                    explanation: "HEATMAPPARMステートメントで座標とカラーグループを指定してワッフルチャートを構築します。"
                },
                {
                    id: "q203_4",
                    type: "fill",
                    question: "円グラフやドーナツグラフを作成するプロシジャ名は？（PROCに続く部分をアルファベットで）",
                    answer: "SGPIE",
                    explanation: "PROC SGPIEは円グラフとドーナツグラフを作成する専用プロシジャです。PIEステートメントで円グラフ、DONUTステートメントでドーナツグラフを作成します。"
                }
            ]
        },
        {
            id: 204,
            title: "ランキング・比較グラフ（3種類）",
            duration: "15分",
            content: `
<h2>ランキングと比較の可視化</h2>
<p>データの順位付けや累積的な変化を可視化するためのグラフを学びます。ドットプロット、ウォーターフォールチャート、パレート図はビジネスレポートや品質管理で広く使用されています。</p>

<h3>【グラフ32】ドットプロット DOT</h3>
<p>カテゴリごとの値を点で表示し、棒グラフよりもすっきりとした比較を可能にします。</p>

<pre><code>proc sgplot data=sashelp.cars;
  where type="Sedan" and make in
    ("Acura" "Audi" "BMW" "Honda" "Toyota");
  dot make / response=mpg_city
    stat=mean
    limitstat=stderr
    markerattrs=(symbol=circlefilled size=10);
run;</code></pre>

<div class="info-box tip">
<div class="info-box-title">ドットプロットの活用</div>
<ul>
<li>DOTステートメントはHBARに似ていますが、棒の代わりにドット（点）を使用します</li>
<li><code>LIMITSTAT=</code>オプションで誤差棒（標準誤差、標準偏差、信頼区間）を追加できます</li>
<li>カテゴリが多い場合、棒グラフよりも視認性が高い場合があります</li>
</ul>
</div>

<h3>【グラフ33】ウォーターフォールチャート WATERFALL</h3>
<p>初期値からの増減を段階的に表示し、最終値に至るまでの過程を可視化します。財務分析でよく使われます。</p>

<pre><code>/* ウォーターフォール用データの準備 */
data waterfall;
  input category $20. amount;
  datalines;
  初期売上       1000
  新規顧客        250
  既存顧客増      150
  値上げ効果      100
  顧客離脱       -200
  値引き         -80
  ;
run;

proc sgplot data=waterfall;
  waterfall category=category response=amount /
    colorgroup=_WATERFALLGROUP_
    datalabel=amount;
run;</code></pre>

<div class="info-box success">
<div class="info-box-title">WATERFALLステートメント</div>
SAS 9.4M5以降ではPROC SGPLOTに<code>WATERFALL</code>ステートメントが追加されています。<code>_WATERFALLGROUP_</code>は自動的に生成されるグループ変数で、正の値・負の値・合計を色分けします。
</div>

<h3>【グラフ34】パレート図</h3>
<p>棒グラフ（度数）と折れ線グラフ（累積百分率）を組み合わせたグラフです。品質管理の「80-20の法則」の可視化に使われます。VBARとSERIESの組み合わせ＋Y2AXISで作成します。</p>

<pre><code>/* パレート図用データ準備 */
proc freq data=sashelp.cars noprint;
  tables type / out=freq_data;
run;

proc sort data=freq_data;
  by descending count;
run;

data pareto;
  set freq_data;
  cumcount + count;
  total = sum(count);
  cumpct = (cumcount / 428) * 100;
run;

proc sgplot data=pareto;
  vbar type / response=count
    categoryorder=respdesc
    datalabel;
  series x=type y=cumpct /
    y2axis markers
    lineattrs=(color=red thickness=2)
    markerattrs=(color=red symbol=circlefilled);
  yaxis label="度数";
  y2axis label="累積百分率（%）" max=100;
  refline 80 / axis=y2 lineattrs=(pattern=dash color=gray);
run;</code></pre>

<div class="info-box tip">
<div class="info-box-title">パレート図のポイント</div>
<ul>
<li><strong>Y2AXIS:</strong> SERIESに<code>y2axis</code>オプションを追加すると、右側のY軸を使用します</li>
<li><strong>REFLINE:</strong> 80%ラインを追加すると「80-20の法則」を視覚化できます</li>
<li><strong>CATEGORYORDER=RESPDESC:</strong> 度数の降順でカテゴリを並べ替えます</li>
<li>データの事前ソートと累積計算が必要です</li>
</ul>
</div>

<h2>比較グラフのまとめ</h2>
<table>
<tr><th>グラフ</th><th>用途</th><th>ステートメント</th></tr>
<tr><td>ドットプロット</td><td>カテゴリ間の値比較</td><td>DOT</td></tr>
<tr><td>ウォーターフォール</td><td>増減の段階的表示</td><td>WATERFALL</td></tr>
<tr><td>パレート図</td><td>度数+累積百分率</td><td>VBAR + SERIES + Y2AXIS</td></tr>
</table>
            `,
            quiz: [
                {
                    id: "q204_1",
                    type: "choice",
                    question: "パレート図で累積百分率の折れ線を右側のY軸に表示するために必要なオプションはどれですか？",
                    options: ["RIGHTAXIS", "SECONDAXIS", "Y2AXIS", "DUALAXIS"],
                    answer: 2,
                    explanation: "SERIESステートメントにY2AXISオプションを追加すると、右側のY軸（第2Y軸）を使用して表示します。"
                },
                {
                    id: "q204_2",
                    type: "choice",
                    question: "ウォーターフォールチャートで正負の値を自動的に色分けする変数はどれですか？",
                    options: ["_COLOR_", "_GROUP_", "_WATERFALLGROUP_", "_SIGN_"],
                    answer: 2,
                    explanation: "_WATERFALLGROUP_は自動的に生成されるグループ変数で、正の値、負の値、合計をそれぞれ異なる色で表示します。"
                },
                {
                    id: "q204_3",
                    type: "choice",
                    question: "ドットプロットで誤差棒を追加するオプションはどれですか？",
                    options: ["ERROR=", "LIMITSTAT=", "ERRORBAR=", "RANGE="],
                    answer: 1,
                    explanation: "LIMITSTAT=オプションで誤差棒の種類を指定します。STDERR（標準誤差）、STDDEV（標準偏差）、CLM（信頼区間）などが使えます。"
                },
                {
                    id: "q204_4",
                    type: "fill",
                    question: "パレート図で視覚化される「何対何の法則」ですか？（数字2つをハイフンで繋いで）",
                    answer: "80-20",
                    explanation: "パレート図は「80-20の法則」（パレートの法則）を可視化します。全体の80%の結果が上位20%の原因から生じるという経験則です。"
                }
            ]
        }
    ]
};
