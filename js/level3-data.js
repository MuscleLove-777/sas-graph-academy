/* ============================================
   Level 3: 高度なSGPLOTグラフ
   ============================================ */
const LEVEL3_DATA = {
    id: 3,
    title: "高度なSGPLOTグラフ",
    icon: "🎨",
    description: "ヒートマップ、ベクトル、二軸グラフなど応用的な17種類を学ぶ",
    modules: [
        {
            id: 301,
            title: "ヒートマップとタイルグラフ（5種類）",
            duration: "15分",
            content: `
<h2>ヒートマップとタイルグラフ</h2>
<p>ヒートマップは2次元データの密度や値の大きさを色で表現するグラフです。SGPLOTでは<strong>HEATMAP文</strong>と<strong>HEATMAPPARM文</strong>の2つの方法でヒートマップを作成できます。さらに応用として相関行列やカレンダー形式の可視化も可能です。</p>

<h3>【グラフ35】ヒートマップ HEATMAP</h3>
<p>連続変数のビン（区間）ごとの頻度を色で表現します。散布図のように個々の点を描くのではなく、データの密度を直感的に把握できます。</p>
<pre><code>proc sgplot data=sashelp.heart;
    heatmap x=height y=weight /
        colormodel=(white yellow orange red)
        nxbins=20 nybins=20;
    xaxis label="身長";
    yaxis label="体重";
run;</code></pre>

<div class="info-box tip">
<div class="info-box-title">ポイント</div>
<strong>NXBINS=</strong>と<strong>NYBINS=</strong>でビンの数を制御します。ビン数を増やすと細かい分布が見え、減らすと全体的な傾向が明確になります。
</div>

<h3>【グラフ36】パラメトリックヒートマップ HEATMAPPARM</h3>
<p>ビンの自動集計ではなく、各セルの座標と色の値を明示的に指定するヒートマップです。あらかじめ集計済みのデータやマトリクス形式のデータに適しています。</p>
<pre><code>data heatdata;
    do x = 1 to 10;
        do y = 1 to 10;
            z = sin(x/3) * cos(y/3);
            output;
        end;
    end;
run;

proc sgplot data=heatdata;
    heatmapparm x=x y=y colorresponse=z /
        colormodel=(blue white red);
    xaxis label="X";
    yaxis label="Y";
run;</code></pre>

<h3>【グラフ37】ブロックプロット BLOCK</h3>
<p>BLOCK文はカテゴリ変数をブロック状のタイルで表示します。データの区分をカラータイルで視覚的に示す際に使います。</p>
<pre><code>proc sgplot data=sashelp.class;
    block x=name block=sex /
        filltype=alternate
        altfillattrs=(color=lightblue)
        fillattrs=(color=lightpink);
run;</code></pre>

<h3>【グラフ38】相関行列ヒートマップ</h3>
<p>PROC CORRで算出した相関係数をHEATMAPPARMで可視化します。多変量データの変数間関係を一目で把握できる重要な手法です。</p>
<pre><code>/* 相関行列を出力 */
proc corr data=sashelp.iris nosimple
    outp=corr_out(where=(_TYPE_='CORR'));
    var SepalLength SepalWidth PetalLength PetalWidth;
run;

/* 縦長に変換 */
data corr_long;
    set corr_out;
    array vars{*} SepalLength SepalWidth PetalLength PetalWidth;
    do i = 1 to dim(vars);
        y_var = vname(vars{i});
        corr = vars{i};
        output;
    end;
    rename _NAME_ = x_var;
    keep _NAME_ y_var corr;
run;

proc sgplot data=corr_long;
    heatmapparm x=x_var y=y_var colorresponse=corr /
        colormodel=(blue white red)
        discretex discretey;
    text x=x_var y=y_var text=corr /
        textattrs=(size=10pt);
run;</code></pre>

<h3>【グラフ39】カレンダーヒートマップ</h3>
<p>日付データを曜日×週のタイル形式で表示します。GitHubのコントリビューショングラフのような表現が可能です。</p>
<pre><code>data calendar;
    do date = '01JAN2024'd to '31DEC2024'd;
        week = week(date);
        dow = weekday(date);
        value = ranuni(123) * 100;
        output;
    end;
    format date date9.;
run;

proc sgplot data=calendar;
    heatmapparm x=week y=dow colorresponse=value /
        colormodel=(white lightgreen green darkgreen)
        discretey;
    yaxis type=discrete reverse
        values=(1 2 3 4 5 6 7)
        valuesdisplay=('日' '月' '火' '水' '木' '金' '土');
    xaxis label="週番号";
run;</code></pre>

<div class="info-box formula">
<div class="info-box-title">主要オプション一覧</div>
<ul>
<li><strong>COLORMODEL=</strong>: 色のグラデーションを指定（例: (blue white red)）</li>
<li><strong>NXBINS= / NYBINS=</strong>: ビンの数（HEATMAP文のみ）</li>
<li><strong>COLORRESPONSE=</strong>: 色に対応する応答変数（HEATMAPPARM文）</li>
<li><strong>DISCRETEX / DISCRETEY</strong>: 軸を離散値として扱う</li>
</ul>
</div>
            `,
            quiz: [
                {
                    id: "q301_1",
                    type: "choice",
                    question: "HEATMAPとHEATMAPPARMの違いとして正しいものはどれですか？",
                    options: ["HEATMAPは3D、HEATMAPPARMは2D", "HEATMAPは自動ビン集計、HEATMAPPARMは座標と値を明示指定", "HEATMAPはカテゴリ用、HEATMAPPARMは連続用", "違いはなく同義である"],
                    answer: 1,
                    explanation: "HEATMAPは連続変数を自動的にビンに分けて頻度を色表示します。HEATMAPPARMは各セルのX, Y座標とCOLORRESPONSE値を明示的に指定します。"
                },
                {
                    id: "q301_2",
                    type: "choice",
                    question: "ヒートマップの色グラデーションを指定するオプションはどれですか？",
                    options: ["COLORRANGE=", "COLORMODEL=", "GRADIENT=", "FILLCOLOR="],
                    answer: 1,
                    explanation: "COLORMODEL=オプションで色のグラデーションを指定します。例: COLORMODEL=(blue white red)"
                },
                {
                    id: "q301_3",
                    type: "choice",
                    question: "HEATMAPのビン数を制御するオプションはどれですか？",
                    options: ["BINS= / YBINS=", "NXBINS= / NYBINS=", "XBINS= / YBINS=", "BINCOUNT="],
                    answer: 1,
                    explanation: "NXBINS=とNYBINS=でX軸とY軸のビン数をそれぞれ制御できます。"
                },
                {
                    id: "q301_4",
                    type: "fill",
                    question: "HEATMAPPARMで色に対応する応答変数を指定するオプション名は？（英語で）",
                    answer: "COLORRESPONSE",
                    explanation: "COLORRESPONSE=オプションで色に対応する応答変数を指定します。"
                }
            ]
        },
        {
            id: 302,
            title: "ハイロー・レンジグラフ（4種類）",
            duration: "15分",
            content: `
<h2>ハイロー・レンジグラフ</h2>
<p>ハイローグラフは<strong>上限値と下限値のペア</strong>をバーやラインで表現するグラフです。株価チャート、気温の変動範囲、信頼区間の表示など幅広い用途で使われます。SGPLOTでは<strong>HIGHLOW文</strong>と<strong>BAND文</strong>で作成できます。</p>

<h3>【グラフ40】ハイローバーチャート HIGHLOW TYPE=BAR</h3>
<p>高値と安値をバー（棒）で表示します。各カテゴリの範囲を視覚的に比較するのに適しています。</p>
<pre><code>data temp_range;
    input month $ high low;
    datalines;
1月 8 1
2月 10 2
3月 14 5
4月 19 10
5月 24 15
6月 27 19
7月 31 23
8月 33 24
9月 29 20
10月 22 14
11月 16 8
12月 11 3
;
run;

proc sgplot data=temp_range;
    highlow x=month high=high low=low /
        type=bar
        fillattrs=(color=lightblue)
        barwidth=0.6;
    xaxis label="月" type=discrete;
    yaxis label="気温 (°C)";
    title "東京の月別気温範囲";
run;</code></pre>

<h3>【グラフ41】ハイローラインチャート HIGHLOW TYPE=LINE</h3>
<p>高値と安値をライン（縦線）で表示します。バーチャートよりもシンプルで、多数のデータポイントがある場合に見やすくなります。</p>
<pre><code>proc sgplot data=temp_range;
    highlow x=month high=high low=low /
        type=line
        lineattrs=(thickness=3 color=steelblue)
        highcap=serif lowcap=serif;
    xaxis label="月" type=discrete;
    yaxis label="気温 (°C)";
run;</code></pre>

<div class="info-box tip">
<div class="info-box-title">ポイント</div>
<strong>HIGHCAP=</strong>と<strong>LOWCAP=</strong>で線の端にキャップ（横線）を付けることができます。値はSERIF（横線）やFILLEDARROW（矢印）などを指定できます。
</div>

<h3>【グラフ42】ローソク足チャート</h3>
<p>株価データの始値・終値・高値・安値を1本のローソクで表現する金融チャートです。HIGHLOW文にOPEN=とCLOSE=を追加して作成します。</p>
<pre><code>data stock;
    input date :yymmdd10. open high low close;
    format date yymmdd10.;
    datalines;
2024-01-02 33500 33800 33200 33700
2024-01-03 33700 34100 33500 33600
2024-01-04 33600 33900 33300 33800
2024-01-05 33800 34200 33700 34100
2024-01-08 34100 34500 34000 34300
;
run;

proc sgplot data=stock;
    highlow x=date high=high low=low /
        open=open close=close
        type=bar;
    xaxis label="日付";
    yaxis label="株価 (円)";
    title "ローソク足チャート";
run;</code></pre>

<h3>【グラフ43】レンジバンドグラフ BAND</h3>
<p>BAND文は上限と下限の間を塗りつぶした帯で表示します。信頼区間や予測区間の可視化に最適です。</p>
<pre><code>data forecast;
    do x = 1 to 50;
        y = 10 + 0.5*x + sin(x/5)*3;
        upper = y + 2 + ranuni(1)*2;
        lower = y - 2 - ranuni(1)*2;
        output;
    end;
run;

proc sgplot data=forecast;
    band x=x upper=upper lower=lower /
        fillattrs=(color=lightblue transparency=0.5)
        legendlabel="95%信頼区間";
    series x=x y=y /
        lineattrs=(color=navy thickness=2)
        legendlabel="予測値";
    xaxis label="時点";
    yaxis label="値";
run;</code></pre>

<div class="info-box formula">
<div class="info-box-title">主要オプション一覧</div>
<ul>
<li><strong>OPEN= / CLOSE=</strong>: ローソク足の始値・終値を指定</li>
<li><strong>HIGHCAP= / LOWCAP=</strong>: 線の端のキャップ形状（SERIF, FILLEDARROW等）</li>
<li><strong>FILLATTRS=</strong>: バーや帯の塗りつぶし属性</li>
<li><strong>TYPE=BAR / LINE</strong>: バー表示とライン表示を切り替え</li>
</ul>
</div>
            `,
            quiz: [
                {
                    id: "q302_1",
                    type: "choice",
                    question: "ローソク足チャートを作成するために必要なHIGHLOWのオプションはどれですか？",
                    options: ["START= END=", "OPEN= CLOSE=", "BEGIN= FINISH=", "FIRST= LAST="],
                    answer: 1,
                    explanation: "OPEN=で始値、CLOSE=で終値を指定することでローソク足チャートになります。"
                },
                {
                    id: "q302_2",
                    type: "choice",
                    question: "信頼区間をバンド（帯）で表示する文はどれですか？",
                    options: ["RANGE文", "BAND文", "INTERVAL文", "AREA文"],
                    answer: 1,
                    explanation: "BAND文で上限(UPPER=)と下限(LOWER=)の間を塗りつぶした帯を描画します。"
                },
                {
                    id: "q302_3",
                    type: "choice",
                    question: "HIGHLOW文のTYPE=オプションで指定できる表示形式はどれですか？",
                    options: ["BAR / LINE", "SOLID / DASH", "FILL / OUTLINE", "THICK / THIN"],
                    answer: 0,
                    explanation: "TYPE=BARでバー表示、TYPE=LINEでライン表示を指定できます。"
                },
                {
                    id: "q302_4",
                    type: "fill",
                    question: "HIGHLOW文のライン端にキャップ（横線）を付けるオプション名は？（高値側、英語で）",
                    answer: "HIGHCAP",
                    explanation: "HIGHCAP=で高値側、LOWCAP=で低値側のキャップ形状を指定します。"
                }
            ]
        },
        {
            id: 303,
            title: "ベクトル・ポリゴン・テキスト（4種類）",
            duration: "15分",
            content: `
<h2>ベクトル・ポリゴン・テキスト</h2>
<p>SGPLOTではベクトル（矢印）、ポリゴン（多角形）、テキスト注釈を描画でき、高度なカスタム可視化が可能です。参照線やドロップラインと組み合わせることでさらに表現力が増します。</p>

<h3>【グラフ44】ベクトル VECTOR</h3>
<p>VECTOR文は原点から指定座標への矢印を描画します。物理学の力の方向やPCA（主成分分析）のローディングプロットなどに用います。</p>
<pre><code>data vectors;
    input label $ x y;
    datalines;
PC1_load1 0.8 0.3
PC1_load2 -0.2 0.9
PC1_load3 0.6 -0.5
PC1_load4 -0.7 -0.4
;
run;

proc sgplot data=vectors aspect=1;
    vector x=x y=y /
        xorigin=0 yorigin=0
        arrowheadshape=filled
        lineattrs=(thickness=2);
    text x=x y=y text=label /
        position=right;
    refline 0 / axis=x lineattrs=(pattern=dash color=gray);
    refline 0 / axis=y lineattrs=(pattern=dash color=gray);
    xaxis min=-1 max=1 label="PC1";
    yaxis min=-1 max=1 label="PC2";
    title "PCAローディングプロット";
run;</code></pre>

<div class="info-box tip">
<div class="info-box-title">ポイント</div>
<strong>XORIGIN=</strong>と<strong>YORIGIN=</strong>で矢印の始点を指定します。デフォルトは(0,0)ですが、任意の座標を始点にできます。<strong>ARROWHEADSHAPE=</strong>で矢印の形状（FILLED, OPEN, BARBED等）を選択できます。
</div>

<h3>【グラフ45】ポリゴン POLYGON</h3>
<p>POLYGON文は頂点座標を結んで多角形を描画します。地図データの可視化やカスタム形状の描画に使えます。</p>
<pre><code>data hexagon;
    id = 1;
    do angle = 0 to 300 by 60;
        x = cos(angle * constant('pi') / 180);
        y = sin(angle * constant('pi') / 180);
        output;
    end;
    id = 2;
    do angle = 0 to 300 by 60;
        x = 2 + 0.5*cos(angle * constant('pi') / 180);
        y = 0.5*sin(angle * constant('pi') / 180);
        output;
    end;
run;

proc sgplot data=hexagon;
    polygon x=x y=y id=id /
        fillattrs=(transparency=0.3)
        fill outline;
    xaxis label="X";
    yaxis label="Y";
run;</code></pre>

<h3>【グラフ46】テキスト TEXT</h3>
<p>TEXT文は任意の位置にテキストラベルを配置します。散布図のデータポイントにラベルを付けたり、グラフ上に注釈を追加する際に使います。</p>
<pre><code>proc sgplot data=sashelp.class;
    scatter x=height y=weight;
    text x=height y=weight text=name /
        position=right
        textattrs=(size=8pt color=gray)
        strip;
    xaxis label="身長";
    yaxis label="体重";
run;</code></pre>

<div class="info-box tip">
<div class="info-box-title">ポイント</div>
<strong>POSITION=</strong>でテキスト位置を指定します（RIGHT, LEFT, TOP, BOTTOM, CENTER等）。<strong>STRIP</strong>オプションを付けるとテキストの背景に帯を表示して可読性を向上させます。
</div>

<h3>【グラフ47】参照線+ドロップライン REFLINE + DROPLINE</h3>
<p>REFLINE文は固定値の水平線・垂直線を描画し、DROPLINE文は特定のデータポイントから軸に向かって線を引きます。基準値や閾値の表示に便利です。</p>
<pre><code>data sample;
    do x = 1 to 20;
        y = 10 + 3*x + rannor(42)*5;
        output;
    end;
run;

proc sgplot data=sample;
    scatter x=x y=y /
        markerattrs=(symbol=circlefilled size=10);
    refline 40 / axis=y
        lineattrs=(color=red pattern=dash thickness=2)
        label="閾値=40"
        labelattrs=(color=red);
    dropline x=10 y=40 /
        dropto=both
        lineattrs=(color=blue pattern=dot);
    xaxis label="X";
    yaxis label="Y";
run;</code></pre>

<div class="info-box formula">
<div class="info-box-title">主要オプション一覧</div>
<ul>
<li><strong>XORIGIN= / YORIGIN=</strong>: ベクトルの始点座標</li>
<li><strong>ARROWHEADSHAPE=</strong>: 矢印の形状（FILLED, OPEN, BARBED）</li>
<li><strong>POSITION=</strong>: テキストの配置位置</li>
<li><strong>STRIP</strong>: テキスト背景の帯を表示</li>
<li><strong>DROPTO=</strong>: ドロップラインの方向（X, Y, BOTH）</li>
</ul>
</div>
            `,
            quiz: [
                {
                    id: "q303_1",
                    type: "choice",
                    question: "VECTOR文で矢印の始点を指定するオプションはどれですか？",
                    options: ["STARTX= / STARTY=", "XORIGIN= / YORIGIN=", "FROMX= / FROMY=", "BASEX= / BASEY="],
                    answer: 1,
                    explanation: "XORIGIN=とYORIGIN=で矢印の始点座標を指定します。デフォルトは(0,0)です。"
                },
                {
                    id: "q303_2",
                    type: "choice",
                    question: "POLYGON文で多角形を描画するために必要なID変数の役割は何ですか？",
                    options: ["色の指定", "同じ多角形に属する頂点をグループ化", "描画順の制御", "サイズの指定"],
                    answer: 1,
                    explanation: "ID変数は同じ多角形に属する頂点をグループ化するために使います。異なるIDは別の多角形として描画されます。"
                },
                {
                    id: "q303_3",
                    type: "choice",
                    question: "TEXT文でテキスト背景に帯を表示するオプションはどれですか？",
                    options: ["BACKGROUND", "STRIP", "BAND", "HIGHLIGHT"],
                    answer: 1,
                    explanation: "STRIPオプションでテキスト背景に帯を表示し、可読性を向上させます。"
                },
                {
                    id: "q303_4",
                    type: "fill",
                    question: "DROPLINE文でX軸とY軸の両方に線を引くDROPTO=の値は？（英語で）",
                    answer: "BOTH",
                    explanation: "DROPTO=BOTHでX軸とY軸の両方向にドロップラインを引きます。"
                }
            ]
        },
        {
            id: 304,
            title: "複合グラフと二軸・マトリクス（4種類）",
            duration: "15分",
            content: `
<h2>複合グラフと二軸・マトリクス</h2>
<p>SGPLOTでは複数のプロット文を重ね合わせるオーバーレイや、二軸(Y2AXIS)を活用した複合グラフが作成できます。さらにPROC SGSCATTERを使えばマトリクス散布図や比較散布図も簡単に作成できます。</p>

<h3>【グラフ48】棒+折れ線オーバーレイ（VBAR + SERIES）</h3>
<p>SGPLOTでは複数のプロット文を1つのPROC SGPLOTブロック内に記述するだけで自動的にオーバーレイされます。棒グラフと折れ線グラフの重ね合わせは最も一般的な複合グラフの一つです。</p>
<pre><code>data sales;
    input quarter $ revenue profit_rate;
    datalines;
Q1 1200 15.5
Q2 1350 16.2
Q3 1100 13.8
Q4 1500 18.1
;
run;

proc sgplot data=sales;
    vbar quarter / response=revenue
        fillattrs=(color=steelblue)
        legendlabel="売上高";
    series x=quarter y=profit_rate /
        y2axis
        lineattrs=(color=red thickness=2)
        markers markerattrs=(symbol=circlefilled color=red)
        legendlabel="利益率(%)";
    yaxis label="売上高（万円）";
    y2axis label="利益率（%）";
    keylegend / location=inside position=topright;
run;</code></pre>

<h3>【グラフ49】二軸グラフ Y2AXIS</h3>
<p>Y2AXISオプションを使うと、右側に第2のY軸を配置でき、スケールが異なる2つの指標を同一グラフ上に表示できます。</p>
<pre><code>data weather;
    input month $ temp rainfall;
    datalines;
1月 5.2 52
2月 5.7 56
3月 8.7 118
4月 13.9 125
5月 18.2 138
6月 21.4 168
7月 25.0 154
8月 26.4 168
9月 22.8 210
10月 17.5 198
11月 12.1 93
12月 7.6 51
;
run;

proc sgplot data=weather;
    vbar month / response=rainfall
        fillattrs=(color=lightblue)
        legendlabel="降水量(mm)";
    series x=month y=temp /
        y2axis
        lineattrs=(color=red thickness=2)
        markers markerattrs=(symbol=circlefilled color=red)
        legendlabel="気温(°C)";
    yaxis label="降水量 (mm)";
    y2axis label="気温 (°C)";
run;</code></pre>

<div class="info-box warning">
<div class="info-box-title">注意</div>
二軸グラフは便利ですが、読者がどちらの軸に対応するか混乱する場合があります。色や凡例を適切に設定し、対応関係を明確にしましょう。
</div>

<h3>【グラフ50】マトリクス散布図 PROC SGSCATTER MATRIX</h3>
<p>PROC SGSCATTERのMATRIX文は、複数の変数のすべての組み合わせの散布図を行列形式で一覧表示します。変数間の関係を探索的に分析する際に非常に有用です。</p>
<pre><code>proc sgscatter data=sashelp.iris;
    matrix SepalLength SepalWidth PetalLength PetalWidth /
        group=Species
        diagonal=(histogram kernel)
        ellipse=(type=predicted);
    title "Iris データセットの変数間関係";
run;</code></pre>

<div class="info-box tip">
<div class="info-box-title">ポイント</div>
<strong>DIAGONAL=</strong>オプションで対角セルにヒストグラムやカーネル密度推定を表示できます。DIAGONAL=(HISTOGRAM KERNEL) と記述します。
</div>

<h3>【グラフ51】比較散布図 PROC SGSCATTER COMPARE</h3>
<p>COMPARE文は異なるX変数とY変数の組み合わせを並べて比較します。MATRIX文とは異なり、特定の変数間の関係のみを表示したい場合に使います。</p>
<pre><code>proc sgscatter data=sashelp.iris;
    compare x=(SepalLength SepalWidth)
            y=(PetalLength PetalWidth) /
        group=Species
        reg=(nogroup degree=1 cli clm);
    title "がく片 vs 花弁の比較";
run;</code></pre>

<div class="info-box formula">
<div class="info-box-title">主要オプション一覧</div>
<ul>
<li><strong>Y2AXIS</strong>: プロット文にこのオプションを付けると右側の第2Y軸に対応</li>
<li><strong>KEYLEGEND</strong>: 凡例の表示・位置を制御</li>
<li><strong>DIAGONAL=(HISTOGRAM KERNEL)</strong>: マトリクスの対角にヒストグラムとカーネル密度を表示</li>
<li><strong>ELLIPSE=</strong>: 散布図に信頼楕円を追加</li>
</ul>
</div>
            `,
            quiz: [
                {
                    id: "q304_1",
                    type: "choice",
                    question: "SGPLOTで右側に第2のY軸を配置するオプションはどれですか？",
                    options: ["RIGHTAXIS", "Y2AXIS", "SECONDY", "DUALAXIS"],
                    answer: 1,
                    explanation: "Y2AXISオプションをプロット文に付けると、そのプロットが右側の第2Y軸に対応します。"
                },
                {
                    id: "q304_2",
                    type: "choice",
                    question: "PROC SGSCATTERのMATRIX文で対角セルにヒストグラムを表示するオプションはどれですか？",
                    options: ["DIAG=(HISTOGRAM)", "DIAGONAL=(HISTOGRAM)", "CENTER=(HISTOGRAM)", "INSET=(HISTOGRAM)"],
                    answer: 1,
                    explanation: "DIAGONAL=(HISTOGRAM)で対角セルにヒストグラムを表示できます。DIAGONAL=(HISTOGRAM KERNEL)でカーネル密度も重ねて表示できます。"
                },
                {
                    id: "q304_3",
                    type: "choice",
                    question: "PROC SGSCATTERのCOMPARE文とMATRIX文の違いとして正しいものはどれですか？",
                    options: ["COMPAREは3D、MATRIXは2D", "COMPAREは指定した変数の組み合わせのみ、MATRIXは全組み合わせ", "COMPAREはグループ分けできない", "違いはない"],
                    answer: 1,
                    explanation: "MATRIX文は指定した全変数の組み合わせを表示しますが、COMPARE文はX変数群とY変数群を別々に指定して特定の組み合わせだけを表示します。"
                },
                {
                    id: "q304_4",
                    type: "fill",
                    question: "SGPLOTで複合グラフを作るには、同じPROC SGPLOTブロック内に複数の何を記述しますか？（日本語で）",
                    answer: "プロット文",
                    explanation: "SGPLOTでは複数のプロット文（VBAR, SERIES, SCATTER等）を1つのPROC SGPLOTブロック内に記述するだけで自動的にオーバーレイされます。"
                }
            ]
        }
    ]
};