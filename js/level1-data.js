/* ============================================
   Level 1: SGPLOTの基本グラフ
   ============================================ */
const LEVEL1_DATA = {
    id: 1,
    title: "SGPLOTの基本グラフ",
    icon: "📊",
    description: "PROC SGPLOTの基本ステートメントで17種類の基本グラフをマスターする",
    modules: [
        {
            id: 101,
            title: "SASグラフの概要とSGPLOT入門",
            duration: "15分",
            content: `
<h2>ODS Graphics体系の全体像</h2>
<p>SASのグラフ出力は<strong>ODS Graphics</strong>フレームワークによって統一的に管理されています。このアカデミーでは、ODS Graphicsの中核を構成する複数のプロシジャを体系的に学びます。</p>

<table>
<tr><th>コンポーネント</th><th>用途</th></tr>
<tr><td>PROC SGPLOT</td><td>単一セルグラフ</td></tr>
<tr><td>PROC SGPANEL</td><td>パネル（格子）グラフ</td></tr>
<tr><td>PROC SGSCATTER</td><td>散布図マトリクス</td></tr>
<tr><td>PROC SGPIE</td><td>円/ドーナツグラフ</td></tr>
<tr><td>GTL (PROC TEMPLATE)</td><td>完全カスタムグラフ</td></tr>
<tr><td>PROC GMAP</td><td>地図グラフ</td></tr>
</table>

<h2>ODS出力先の設定</h2>
<p>グラフの出力形式を指定するには、ODS出力先を設定します。以下はHTML出力の基本設定例です。</p>

<pre><code>ods html file="output.html" style=HTMLBlue;

proc sgplot data=sashelp.class;
  vbar sex;
run;

ods html close;</code></pre>

<div class="info-box tip">
<div class="info-box-title">ODS出力先の種類</div>
<ul>
<li><strong>ODS HTML:</strong> Webブラウザ表示用（PNG/SVG画像）</li>
<li><strong>ODS PDF:</strong> PDF文書出力</li>
<li><strong>ODS RTF:</strong> Word文書互換出力</li>
<li><strong>ODS LISTING:</strong> 従来型のリスト出力</li>
<li><strong>ODS POWERPOINT:</strong> PowerPoint出力</li>
</ul>
</div>

<h2>PROC SGPLOTの基本構文</h2>
<p>PROC SGPLOTは最も汎用的なグラフプロシジャです。1つのグラフ領域に複数のプロットステートメントを重ね合わせることができます。</p>

<pre><code>proc sgplot data=sashelp.class;
  vbar sex;
run;</code></pre>

<p>上記は最もシンプルな棒グラフの例です。<code>data=</code>でデータセットを指定し、プロットステートメント（ここでは<code>vbar</code>）でグラフの種類を決定します。</p>

<h2>このアカデミーで学ぶ100種類のグラフ</h2>
<p>全6レベルで合計100種類のグラフを体系的に学びます。</p>

<table>
<tr><th>レベル</th><th>テーマ</th><th>グラフ数</th></tr>
<tr><td>Level 1</td><td>SGPLOTの基本グラフ</td><td>17種類</td></tr>
<tr><td>Level 2</td><td>分布・統計・比較グラフ</td><td>17種類</td></tr>
<tr><td>Level 3</td><td>高度なSGPLOTグラフ</td><td>17種類</td></tr>
<tr><td>Level 4</td><td>SGPANELと統計解析グラフ</td><td>17種類</td></tr>
<tr><td>Level 5</td><td>GTLと特殊グラフ</td><td>16種類</td></tr>
<tr><td>Level 6</td><td>臨床試験グラフと実践カスタマイズ</td><td>16種類</td></tr>
</table>

<div class="info-box success">
<div class="info-box-title">学習のポイント</div>
各モジュールでは、SASコードを実際に実行しながら学ぶことを推奨します。sashelp ライブラリのサンプルデータ（class, cars, stocks等）を活用すれば、データ準備なしですぐにグラフを作成できます。
</div>
            `,
            quiz: [
                {
                    id: "q101_1",
                    type: "choice",
                    question: "PROC SGPLOTの主な用途として正しいものはどれですか？",
                    options: ["パネル（格子）グラフの作成", "単一セルグラフの作成", "散布図マトリクスの作成", "地図グラフの作成"],
                    answer: 1,
                    explanation: "PROC SGPLOTは単一セルグラフの作成に使用します。パネルグラフはSGPANEL、散布図マトリクスはSGSCATTER、地図はGMAPを使用します。"
                },
                {
                    id: "q101_2",
                    type: "choice",
                    question: "ODS Graphicsで完全カスタムグラフを作成するために使用するコンポーネントはどれですか？",
                    options: ["PROC SGPLOT", "PROC SGPANEL", "GTL (PROC TEMPLATE)", "PROC SGPIE"],
                    answer: 2,
                    explanation: "GTL（Graph Template Language）はPROC TEMPLATEを通じて使用し、完全にカスタマイズされたグラフレイアウトを作成できます。"
                },
                {
                    id: "q101_3",
                    type: "choice",
                    question: "PROC SGPLOTでデータセットを指定するオプションはどれですか？",
                    options: ["input=", "dataset=", "data=", "source="],
                    answer: 2,
                    explanation: "PROC SGPLOTではdata=オプションでデータセットを指定します。例: proc sgplot data=sashelp.class;"
                },
                {
                    id: "q101_4",
                    type: "fill",
                    question: "円グラフやドーナツグラフを作成するためのプロシジャ名は？（PROC に続く部分をアルファベットで）",
                    answer: "SGPIE",
                    explanation: "PROC SGPIEは円グラフとドーナツグラフを作成するための専用プロシジャです。"
                }
            ]
        },
        {
            id: 102,
            title: "棒グラフ（5種類）",
            duration: "15分",
            content: `
<h2>棒グラフの基本</h2>
<p>棒グラフはカテゴリデータの比較に最も広く使われるグラフです。PROC SGPLOTでは<code>VBAR</code>（縦棒）と<code>HBAR</code>（横棒）の2つのステートメントで作成します。</p>

<h3>【グラフ1】縦棒グラフ VBAR</h3>
<p>最も基本的な棒グラフです。カテゴリ変数の度数を縦棒で表示します。</p>

<pre><code>proc sgplot data=sashelp.class;
  vbar sex;
run;</code></pre>

<h3>【グラフ2】横棒グラフ HBAR</h3>
<p>カテゴリ名が長い場合や、ランキング表示に適しています。</p>

<pre><code>proc sgplot data=sashelp.class;
  hbar sex;
run;</code></pre>

<h3>【グラフ3】積み上げ棒グラフ</h3>
<p><code>GROUP=</code>オプションと<code>GROUPDISPLAY=STACK</code>を組み合わせて、カテゴリ内の内訳を表示します。</p>

<pre><code>proc sgplot data=sashelp.class;
  vbar sex / group=age groupdisplay=stack;
run;</code></pre>

<h3>【グラフ4】グループ棒グラフ</h3>
<p><code>GROUPDISPLAY=CLUSTER</code>で各グループの棒を横に並べて比較します。</p>

<pre><code>proc sgplot data=sashelp.class;
  vbar sex / group=age groupdisplay=cluster;
run;</code></pre>

<h3>【グラフ5】100%積み上げ棒グラフ</h3>
<p><code>PCTLEVEL=GROUP</code>と<code>STAT=PCT</code>で構成比を表示します。</p>

<pre><code>proc sgplot data=sashelp.class pctlevel=group;
  vbar sex / group=age groupdisplay=stack stat=pct;
run;</code></pre>

<h2>棒グラフの主要オプション</h2>
<table>
<tr><th>オプション</th><th>説明</th><th>例</th></tr>
<tr><td>RESPONSE=</td><td>応答変数（連続変数）を指定</td><td>vbar sex / response=height</td></tr>
<tr><td>STAT=</td><td>集計統計量（FREQ, PCT, MEAN, SUM）</td><td>vbar sex / stat=mean response=height</td></tr>
<tr><td>DATALABEL</td><td>棒の上にデータラベルを表示</td><td>vbar sex / datalabel</td></tr>
<tr><td>FILLATTRS=</td><td>棒の塗りつぶし属性</td><td>vbar sex / fillattrs=(color=steelblue)</td></tr>
<tr><td>BARWIDTH=</td><td>棒の幅（0-1）</td><td>vbar sex / barwidth=0.5</td></tr>
<tr><td>CATEGORYORDER=</td><td>カテゴリの表示順序</td><td>vbar sex / categoryorder=respdesc</td></tr>
<tr><td>GROUP=</td><td>グループ変数</td><td>vbar sex / group=age</td></tr>
<tr><td>GROUPDISPLAY=</td><td>グループ表示方法</td><td>stack / cluster</td></tr>
</table>

<div class="info-box tip">
<div class="info-box-title">ベストプラクティス</div>
<ul>
<li>カテゴリ数が多い場合はHBAR（横棒）を使うとラベルが読みやすい</li>
<li>100%積み上げ棒グラフは構成比の比較に最適</li>
<li>DATALABELを付けると正確な値が一目でわかる</li>
</ul>
</div>
            `,
            quiz: [
                {
                    id: "q102_1",
                    type: "choice",
                    question: "積み上げ棒グラフを作成するために必要なオプションの組み合わせはどれですか？",
                    options: ["GROUP= と GROUPDISPLAY=STACK", "RESPONSE= と STAT=SUM", "FILLATTRS= と BARWIDTH=", "DATALABEL と CATEGORYORDER="],
                    answer: 0,
                    explanation: "積み上げ棒グラフはGROUP=でグループ変数を指定し、GROUPDISPLAY=STACKで積み上げ表示にします。"
                },
                {
                    id: "q102_2",
                    type: "choice",
                    question: "100%積み上げ棒グラフを作成する際、PROC SGPLOTステートメントに追加するオプションはどれですか？",
                    options: ["STYLE=PERCENT", "PCTLEVEL=GROUP", "SCALE=100", "NORMALIZE=YES"],
                    answer: 1,
                    explanation: "100%積み上げ棒グラフはPROC SGPLOTにPCTLEVEL=GROUPを指定し、VBARにSTAT=PCTを指定して作成します。"
                },
                {
                    id: "q102_3",
                    type: "choice",
                    question: "棒の塗りつぶし色を変更するオプションはどれですか？",
                    options: ["COLOR=", "FILLATTRS=", "BARCOLOR=", "STYLE="],
                    answer: 1,
                    explanation: "FILLATTRS=オプションで棒の塗りつぶし属性を指定します。例: fillattrs=(color=steelblue)"
                },
                {
                    id: "q102_4",
                    type: "fill",
                    question: "横棒グラフを作成するVBARの対になるステートメント名は？（アルファベット4文字）",
                    answer: "HBAR",
                    explanation: "HBARステートメントは横棒グラフを作成します。カテゴリ名が長い場合やランキング表示に適しています。"
                }
            ]
        },
        {
            id: 103,
            title: "折れ線グラフとエリアグラフ（6種類）",
            duration: "15分",
            content: `
<h2>折れ線グラフとエリアグラフ</h2>
<p>時系列データやトレンドの可視化には折れ線グラフが最適です。PROC SGPLOTでは複数のステートメントで様々な線グラフやエリアグラフを作成できます。</p>

<h3>【グラフ6】折れ線グラフ SERIES</h3>
<p>時系列データの基本的な表示方法です。X軸に時間、Y軸に値を取ります。</p>

<pre><code>proc sgplot data=sashelp.stocks;
  where stock="IBM";
  series x=date y=close;
run;</code></pre>

<h3>【グラフ7】階段グラフ STEP</h3>
<p>離散的な値の変化を階段状に表示します。株価や在庫数など、瞬間的に値が変わるデータに適しています。</p>

<pre><code>proc sgplot data=sashelp.stocks;
  where stock="IBM";
  step x=date y=close;
run;</code></pre>

<h3>【グラフ8】ニードルグラフ NEEDLE</h3>
<p>ベースラインから各データ点までの垂直線を描画します。イベントの発生頻度や強度の表示に適しています。</p>

<pre><code>proc sgplot data=sashelp.stocks;
  where stock="IBM" and year(date)=2005;
  needle x=date y=volume;
run;</code></pre>

<h3>【グラフ9】バンドグラフ BAND</h3>
<p>上限と下限の間の領域を塗りつぶします。信頼区間や範囲の可視化に使用します。</p>

<pre><code>proc sgplot data=sashelp.stocks;
  where stock="IBM";
  band x=date upper=high lower=low /
    transparency=0.5 legendlabel="High-Low Range";
  series x=date y=close;
run;</code></pre>

<h3>【グラフ10】積み上げエリアグラフ</h3>
<p>SERIESステートメントに<code>GROUP=</code>と<code>FILL</code>を指定して、積み上げエリアグラフを作成します。</p>

<pre><code>proc sgplot data=sashelp.stocks;
  series x=date y=close / group=stock fill;
run;</code></pre>

<h3>【グラフ11】スプライン PBSPLINE</h3>
<p>データ点を滑らかな曲線（ペナルティ付きBスプライン）でフィッティングします。</p>

<pre><code>proc sgplot data=sashelp.class;
  pbspline x=height y=weight;
run;</code></pre>

<h2>折れ線・エリアグラフの主要オプション</h2>
<table>
<tr><th>オプション</th><th>説明</th><th>例</th></tr>
<tr><td>LINEATTRS=</td><td>線の属性（色、太さ、パターン）</td><td>lineattrs=(color=red thickness=2)</td></tr>
<tr><td>MARKERS</td><td>データ点にマーカーを表示</td><td>series x=date y=close / markers</td></tr>
<tr><td>CURVELABEL=</td><td>線にラベルを直接付与</td><td>series x=date y=close / curvelabel="IBM"</td></tr>
<tr><td>SMOOTHCONNECT</td><td>滑らかな接続</td><td>series x=date y=close / smoothconnect</td></tr>
<tr><td>FILLEDOUTLINEDMARKERS</td><td>塗りつぶし＋枠線付きマーカー</td><td>series x=date y=close / markers filledoutlinedmarkers</td></tr>
<tr><td>FILL</td><td>線の下の領域を塗りつぶし</td><td>series x=date y=close / fill</td></tr>
<tr><td>TRANSPARENCY=</td><td>透明度（0:不透明 ～ 1:透明）</td><td>band x=date upper=high lower=low / transparency=0.5</td></tr>
</table>

<div class="info-box tip">
<div class="info-box-title">使い分けのポイント</div>
<ul>
<li><strong>SERIES:</strong> 連続的なデータの推移を見る場合に最適</li>
<li><strong>STEP:</strong> 離散的・段階的な変化を正確に表現したい場合</li>
<li><strong>NEEDLE:</strong> 個々のデータ点の大きさを強調したい場合</li>
<li><strong>BAND:</strong> 範囲や不確実性を表現する場合</li>
<li><strong>PBSPLINE:</strong> データの大まかなトレンドを把握したい場合</li>
</ul>
</div>
            `,
            quiz: [
                {
                    id: "q103_1",
                    type: "choice",
                    question: "離散的な値の変化を階段状に表示するステートメントはどれですか？",
                    options: ["SERIES", "STEP", "NEEDLE", "BAND"],
                    answer: 1,
                    explanation: "STEPステートメントはデータの変化を階段状に表示します。株価や在庫数など瞬間的に値が変わるデータに適しています。"
                },
                {
                    id: "q103_2",
                    type: "choice",
                    question: "上限と下限の間の領域を塗りつぶすステートメントはどれですか？",
                    options: ["SERIES", "FILL", "BAND", "AREA"],
                    answer: 2,
                    explanation: "BANDステートメントはUPPER=とLOWER=で指定した上限・下限の間を塗りつぶします。信頼区間の可視化などに使用します。"
                },
                {
                    id: "q103_3",
                    type: "choice",
                    question: "SERIESステートメントで線にラベルを直接付与するオプションはどれですか？",
                    options: ["LABEL=", "CURVELABEL=", "LINELABEL=", "DATALABEL="],
                    answer: 1,
                    explanation: "CURVELABEL=オプションを使うと、線の上に直接ラベルテキストを表示できます。凡例の代わりに使うと見やすくなります。"
                },
                {
                    id: "q103_4",
                    type: "fill",
                    question: "ペナルティ付きBスプラインで滑らかな曲線を描くステートメント名は？（アルファベットで）",
                    answer: "PBSPLINE",
                    explanation: "PBSPLINEステートメントはペナルティ付きBスプラインでデータ点を滑らかな曲線にフィッティングします。"
                }
            ]
        },
        {
            id: 104,
            title: "散布図（6種類）",
            duration: "15分",
            content: `
<h2>散布図の基本</h2>
<p>散布図は2つの連続変数の関係を可視化する基本的なグラフです。PROC SGPLOTでは<code>SCATTER</code>ステートメントを中心に、回帰直線やLOESS曲線の重ね合わせも可能です。</p>

<h3>【グラフ12】基本散布図 SCATTER</h3>
<p>2変数間の関係をプロットする最も基本的な方法です。</p>

<pre><code>proc sgplot data=sashelp.class;
  scatter x=height y=weight;
run;</code></pre>

<h3>【グラフ13】グループ散布図 SCATTER GROUP=</h3>
<p><code>GROUP=</code>オプションでカテゴリ別に色分けして表示します。</p>

<pre><code>proc sgplot data=sashelp.class;
  scatter x=height y=weight / group=sex;
run;</code></pre>

<h3>【グラフ14】バブルチャート BUBBLE</h3>
<p>3つ目の変数をバブルの大きさで表現します。</p>

<pre><code>proc sgplot data=sashelp.class;
  bubble x=height y=weight size=age /
    bradiusmin=5 bradiusmax=20
    transparency=0.3;
run;</code></pre>

<h3>【グラフ15】回帰直線 REG</h3>
<p>散布図に回帰直線と信頼区間を重ねて表示します。CLM（平均の信頼限界）やCLI（個別の予測限界）を追加できます。</p>

<pre><code>proc sgplot data=sashelp.class;
  reg x=height y=weight / clm cli;
run;</code></pre>

<h3>【グラフ16】LOESS平滑化</h3>
<p>局所回帰（LOESS）による滑らかなフィッティング曲線を表示します。非線形な関係の可視化に適しています。</p>

<pre><code>proc sgplot data=sashelp.class;
  loess x=height y=weight / clm;
run;</code></pre>

<h3>【グラフ17】信頼楕円 ELLIPSE</h3>
<p>2変数の同時信頼領域を楕円で表示します。グループ間の分離度を視覚的に確認できます。</p>

<pre><code>proc sgplot data=sashelp.class;
  scatter x=height y=weight / group=sex;
  ellipse x=height y=weight / group=sex
    alpha=0.05 type=predicted;
run;</code></pre>

<h2>散布図の主要オプション</h2>
<table>
<tr><th>オプション</th><th>説明</th><th>例</th></tr>
<tr><td>MARKERATTRS=</td><td>マーカーの属性（形、色、サイズ）</td><td>markerattrs=(symbol=circlefilled color=blue size=10)</td></tr>
<tr><td>TRANSPARENCY=</td><td>透明度（0～1）、重なりの把握に有効</td><td>transparency=0.4</td></tr>
<tr><td>GROUP=</td><td>グループ変数で色分け</td><td>scatter x=height y=weight / group=sex</td></tr>
<tr><td>JITTER</td><td>重なったデータ点を少しずらして表示</td><td>scatter x=height y=weight / jitter</td></tr>
<tr><td>DATALABEL=</td><td>各データ点にラベル表示</td><td>scatter x=height y=weight / datalabel=name</td></tr>
<tr><td>CLM</td><td>平均値の信頼限界（REG/LOESSで使用）</td><td>reg x=height y=weight / clm</td></tr>
<tr><td>CLI</td><td>個別予測値の信頼限界（REGで使用）</td><td>reg x=height y=weight / cli</td></tr>
</table>

<div class="info-box tip">
<div class="info-box-title">散布図活用のポイント</div>
<ul>
<li>データ点が多い場合は<code>TRANSPARENCY=</code>で透明度を設定し、密度を把握しやすくする</li>
<li>離散値のプロットでは<code>JITTER</code>オプションで重なりを軽減できる</li>
<li>線形関係には<code>REG</code>、非線形関係には<code>LOESS</code>を使い分ける</li>
<li><code>ELLIPSE</code>はグループ間の分布の重なりを直感的に把握できる</li>
</ul>
</div>

<div class="info-box warning">
<div class="info-box-title">注意</div>
ELLIPSEステートメントはPROC SGPLOTで直接使用できます。TYPE=オプションでPREDICTED（予測楕円）またはMEAN（平均の信頼楕円）を指定できます。ALPHA=で信頼水準を調整します（デフォルトは0.05、すなわち95%信頼楕円）。
</div>
            `,
            quiz: [
                {
                    id: "q104_1",
                    type: "choice",
                    question: "バブルチャートで3つ目の変数を表現する方法はどれですか？",
                    options: ["色の濃淡", "バブルの大きさ", "マーカーの形", "線の太さ"],
                    answer: 1,
                    explanation: "BUBBLEステートメントではSIZE=オプションで3つ目の変数をバブルの大きさとして表現します。"
                },
                {
                    id: "q104_2",
                    type: "choice",
                    question: "非線形な関係を滑らかな曲線でフィッティングするステートメントはどれですか？",
                    options: ["REG", "LOESS", "PBSPLINE", "ELLIPSE"],
                    answer: 1,
                    explanation: "LOESSステートメントは局所回帰による滑らかなフィッティング曲線を描画し、非線形な関係の可視化に適しています。"
                },
                {
                    id: "q104_3",
                    type: "choice",
                    question: "REGステートメントで個別予測値の信頼限界を表示するオプションはどれですか？",
                    options: ["CLM", "CLI", "CI", "PREDICT"],
                    answer: 1,
                    explanation: "CLIオプションはConfidence Limit for Individual（個別予測値の信頼限界）を表示します。CLMは平均値の信頼限界です。"
                },
                {
                    id: "q104_4",
                    type: "fill",
                    question: "重なったデータ点を少しずらして表示するSCATTERのオプション名は？（アルファベットで）",
                    answer: "JITTER",
                    explanation: "JITTERオプションを使うと、同じ座標に重なったデータ点を少しランダムにずらして表示し、データの密度を把握しやすくなります。"
                }
            ]
        }
    ]
};
