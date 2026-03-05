/* ============================================
   Level 5: GTLと特殊グラフ
   ============================================ */
const LEVEL5_DATA = {
    id: 5,
    title: "GTLと特殊グラフ",
    icon: "🔧",
    description: "Graph Template Languageで16種類の高度なカスタムグラフを作成する",
    modules: [
        {
            id: 501,
            title: "GTL基礎とレイアウト（4種類）",
            duration: "15分",
            content: `
<h2>Graph Template Language（GTL）概要</h2>
<p>GTL（Graph Template Language）は、SASの<strong>PROC TEMPLATE</strong>内で使用するグラフ記述言語です。SGPLOTでは実現できない高度なカスタムグラフを、プログラマティックに構築できます。</p>

<div class="info-box tip">
<div class="info-box-title">GTLの基本構文</div>
<pre><code>proc template;
  define statgraph MyGraph;
    dynamic VAR1 VAR2;
    begingraph;
      entrytitle "グラフタイトル";
      layout overlay;
        scatterplot x=VAR1 y=VAR2;
      endlayout;
    endgraph;
  end;
run;

proc sgrender data=sashelp.class template=MyGraph;
  dynamic VAR1="Height" VAR2="Weight";
run;</code></pre>
</div>

<p>GTLの基本的な流れは以下の通りです。</p>
<ol>
<li><strong>PROC TEMPLATE</strong>でグラフテンプレートを定義する</li>
<li><strong>DEFINE STATGRAPH</strong>でグラフの名前を宣言する</li>
<li><strong>BEGINGRAPH / ENDGRAPH</strong>でグラフ本体を囲む</li>
<li><strong>DYNAMIC</strong>変数で外部からパラメータを受け取る</li>
<li><strong>PROC SGRENDER</strong>でテンプレートにデータを渡して描画する</li>
</ol>

<h2>グラフ69: オーバーレイレイアウト</h2>
<p><strong>LAYOUT OVERLAY</strong>は最も基本的なレイアウトで、複数のプロット要素を同じ座標系に重ね描きします。</p>

<pre><code>proc template;
  define statgraph OverlayDemo;
    dynamic XVAR YVAR GVAR;
    begingraph;
      entrytitle "オーバーレイレイアウト: 散布図 + 回帰直線";
      layout overlay /
        xaxisopts=(label="身長(cm)")
        yaxisopts=(label="体重(kg)");
        scatterplot x=XVAR y=YVAR / group=GVAR
          markerattrs=(size=10);
        regressionplot x=XVAR y=YVAR /
          lineattrs=(color=red thickness=2);
      endlayout;
    endgraph;
  end;
run;

proc sgrender data=sashelp.class template=OverlayDemo;
  dynamic XVAR="Height" YVAR="Weight" GVAR="Sex";
run;</code></pre>

<h2>グラフ70: 格子レイアウト</h2>
<p><strong>LAYOUT LATTICE</strong>は、複数のプロットを行列状に配置する格子レイアウトです。行数・列数を指定して均等に区切ります。</p>

<pre><code>proc template;
  define statgraph LatticeDemo;
    begingraph;
      entrytitle "格子レイアウト: 2x2パネル";
      layout lattice / rows=2 columns=2
        rowweights=(0.6 0.4)
        columnweights=(0.5 0.5);

        layout overlay;
          scatterplot x=Height y=Weight;
        endlayout;

        layout overlay;
          histogram Height;
        endlayout;

        layout overlay;
          boxplot y=Weight category=Sex;
        endlayout;

        layout overlay;
          histogram Weight;
        endlayout;

      endlayout;
    endgraph;
  end;
run;

proc sgrender data=sashelp.class template=LatticeDemo;
run;</code></pre>

<div class="info-box tip">
<div class="info-box-title">ROWWEIGHTS / COLUMNWEIGHTS</div>
<p>各行・列の相対的な幅を指定できます。値の合計は1.0になるようにします。例えばROWWEIGHTS=(0.6 0.4)は上の行を60%、下の行を40%の高さにします。</p>
</div>

<h2>グラフ71: グリッドレイアウト</h2>
<p><strong>LAYOUT GRIDDED</strong>は、要素を格子状に配置しつつ、各セルのサイズを柔軟に調整できるレイアウトです。凡例や注釈の配置に適しています。</p>

<pre><code>proc template;
  define statgraph GridDemo;
    begingraph;
      entrytitle "グリッドレイアウト: メイン + サイドパネル";
      layout gridded / columns=2
        columnweights=(0.7 0.3);

        layout overlay /
          xaxisopts=(label="Height")
          yaxisopts=(label="Weight");
          scatterplot x=Height y=Weight / group=Sex;
        endlayout;

        layout gridded / rows=2;
          entry halign=left "補足情報";
          entry halign=left "N = 19";
        endlayout;

      endlayout;
    endgraph;
  end;
run;

proc sgrender data=sashelp.class template=GridDemo;
run;</code></pre>

<h2>グラフ72: データパネル</h2>
<p><strong>LAYOUT DATAPANEL</strong>は、分類変数の値ごとに自動的にパネルを生成するレイアウトです。PROC SGPANELのGTL版と言えます。</p>

<pre><code>proc template;
  define statgraph DataPanelDemo;
    dynamic XVAR YVAR CLASSVAR;
    begingraph;
      entrytitle "データパネル: クラス変数別パネル";
      layout datapanel classvars=(CLASSVAR) /
        columns=2
        headerlabeldisplay=value
        headerbackgroundcolor=lightblue;

        layout prototype;
          scatterplot x=XVAR y=YVAR /
            markerattrs=(symbol=circlefilled size=8);
        endlayout;

      endlayout;
    endgraph;
  end;
run;

proc sgrender data=sashelp.class template=DataPanelDemo;
  dynamic XVAR="Height" YVAR="Weight" CLASSVAR="Sex";
run;</code></pre>

<div class="info-box formula">
<div class="info-box-title">GTL主要キーワードまとめ</div>
<table>
<tr><th>キーワード</th><th>用途</th></tr>
<tr><td>BEGINGRAPH / ENDGRAPH</td><td>グラフ定義の開始・終了</td></tr>
<tr><td>DYNAMIC</td><td>外部からの変数受け渡し</td></tr>
<tr><td>ENTRY / ENTRYTITLE</td><td>テキスト要素・タイトル</td></tr>
<tr><td>LAYOUT OVERLAY</td><td>重ね描きレイアウト</td></tr>
<tr><td>LAYOUT LATTICE</td><td>格子レイアウト</td></tr>
<tr><td>LAYOUT GRIDDED</td><td>グリッドレイアウト</td></tr>
<tr><td>LAYOUT DATAPANEL</td><td>データ駆動パネル</td></tr>
<tr><td>ROWWEIGHTS / COLUMNWEIGHTS</td><td>行・列の比率指定</td></tr>
</table>
</div>
            `,
            quiz: [
                {
                    id: "q501_1",
                    type: "choice",
                    question: "GTLでグラフテンプレートを定義する際に使用するPROCはどれですか？",
                    options: ["PROC SGPLOT", "PROC SGRENDER", "PROC TEMPLATE", "PROC SGPANEL"],
                    answer: 2,
                    explanation: "GTLのテンプレート定義にはPROC TEMPLATEを使用します。PROC SGRENDERはテンプレートにデータを渡して描画するときに使います。"
                },
                {
                    id: "q501_2",
                    type: "choice",
                    question: "分類変数の値ごとに自動的にパネルを生成するGTLレイアウトはどれですか？",
                    options: ["LAYOUT OVERLAY", "LAYOUT LATTICE", "LAYOUT GRIDDED", "LAYOUT DATAPANEL"],
                    answer: 3,
                    explanation: "LAYOUT DATAPANELは分類変数（CLASSVARS=）の値ごとに自動的にパネルを生成します。SGPANELのGTL版に相当します。"
                },
                {
                    id: "q501_3",
                    type: "choice",
                    question: "GTLで外部からテンプレートにパラメータを渡すために使うキーワードは？",
                    options: ["PARAMETER", "VARIABLE", "DYNAMIC", "EXTERNAL"],
                    answer: 2,
                    explanation: "DYNAMICキーワードでテンプレートに外部変数を定義し、PROC SGRENDERのDYNAMICステートメントで値を渡します。"
                },
                {
                    id: "q501_4",
                    type: "fill",
                    question: "LAYOUT LATTICEで各行の高さの比率を指定するオプション名は？（英大文字で）",
                    answer: "ROWWEIGHTS",
                    explanation: "ROWWEIGHTSオプションで各行の相対的な高さ比率を指定します。値の合計が1.0になるように設定します。"
                }
            ]
        },
        {
            id: 502,
            title: "レーダー・極座標・ゲージ（4種類）",
            duration: "15分",
            content: `
<h2>GTLによる特殊座標系グラフ</h2>
<p>レーダーチャートや極座標グラフは標準のSGPLOTでは直接作成できませんが、<strong>GTLとデータ前処理</strong>を組み合わせることで実現できます。基本的なアイデアは、角度からXY座標への変換です。</p>

<div class="info-box formula">
<div class="info-box-title">極座標→直交座標変換の公式</div>
<p>角度theta（ラジアン）と半径rから直交座標(x, y)を求めます。</p>
<pre><code>x = r * cos(theta);
y = r * sin(theta);</code></pre>
<p>角度をN等分する場合: theta_i = 2 * pi * (i-1) / N</p>
</div>

<h2>グラフ73: レーダーチャート</h2>
<p>レーダーチャート（クモの巣グラフ）は、複数の評価軸を放射状に配置し、値をポリゴンで結んだグラフです。GTLのPOLYGON+TEXTで描画します。</p>

<pre><code>/* レーダーチャート用データの準備 */
%let n_axes = 5;

data radar_scores;
  input category $12. score;
  datalines;
品質         85
コスト       70
納期         90
サポート     75
技術力       88
;
run;

data radar_plot;
  set radar_scores;
  pi = constant('pi');
  n = &n_axes;
  /* 各軸の角度を計算（12時方向から時計回り） */
  angle = pi/2 - 2*pi*(_n_-1)/n;
  /* スコアに基づくXY座標 */
  x = score * cos(angle);
  y = score * sin(angle);
  /* 軸ラベル用の座標（外側に配置） */
  lx = 105 * cos(angle);
  ly = 105 * sin(angle);
  /* グリッド用データも生成 */
  do grid = 20, 40, 60, 80, 100;
    gx = grid * cos(angle);
    gy = grid * sin(angle);
    output;
  end;
run;

proc template;
  define statgraph RadarChart;
    begingraph;
      entrytitle "レーダーチャート: 評価スコア";
      layout overlay /
        xaxisopts=(display=none
          linearopts=(viewmin=-120 viewmax=120))
        yaxisopts=(display=none
          linearopts=(viewmin=-120 viewmax=120));
        /* グリッド線（同心円） */
        polygonplot x=gx y=gy id=grid /
          display=(outline)
          outlineattrs=(color=lightgray pattern=dot);
        /* スコアのポリゴン */
        polygonplot x=x y=y id=eval(1) /
          display=(fill outline)
          fillattrs=(color=steelblue transparency=0.6)
          outlineattrs=(color=navy thickness=2);
        /* 頂点マーカー */
        scatterplot x=x y=y /
          markerattrs=(symbol=circlefilled
            color=navy size=8);
        /* 軸ラベル */
        textplot x=lx y=ly text=category /
          textattrs=(size=9pt weight=bold);
      endlayout;
    endgraph;
  end;
run;

proc sgrender data=radar_plot template=RadarChart;
run;</code></pre>

<h2>グラフ74: スパイダーチャート（複数系列レーダー）</h2>
<p>スパイダーチャートは複数の系列（グループ）を同一レーダー上にオーバーレイ表示します。</p>

<pre><code>data spider_data;
  length group $10 category $12;
  input group $ category $ score;
  datalines;
製品A 品質 85
製品A コスト 70
製品A 納期 90
製品A サポート 75
製品A 技術力 88
製品B 品質 78
製品B コスト 92
製品B 納期 65
製品B サポート 85
製品B 技術力 72
;
run;

data spider_plot;
  set spider_data;
  by group;
  pi = constant('pi');
  n = 5;
  retain seq 0;
  if first.group then seq = 0;
  seq + 1;
  angle = pi/2 - 2*pi*(seq-1)/n;
  x = score * cos(angle);
  y = score * sin(angle);
  lx = 110 * cos(angle);
  ly = 110 * sin(angle);
run;

proc template;
  define statgraph SpiderChart;
    begingraph;
      entrytitle "スパイダーチャート: 製品比較";
      layout overlay /
        xaxisopts=(display=none
          linearopts=(viewmin=-130 viewmax=130))
        yaxisopts=(display=none
          linearopts=(viewmin=-130 viewmax=130));
        polygonplot x=x y=y id=group /
          display=(fill outline)
          fillattrs=(transparency=0.7)
          outlineattrs=(thickness=2)
          group=group;
        scatterplot x=x y=y / group=group
          markerattrs=(symbol=circlefilled size=7);
        textplot x=lx y=ly text=category /
          textattrs=(size=9pt);
      endlayout;
    endgraph;
  end;
run;

proc sgrender data=spider_plot template=SpiderChart;
run;</code></pre>

<h2>グラフ75: 極座標グラフ</h2>
<p>極座標グラフは角度と半径でデータを表現します。風向・風速データや周期性データの可視化に適しています。</p>

<pre><code>/* 風向・風速の極座標プロット */
data wind_data;
  do direction = 0 to 350 by 10;
    theta = direction * constant('pi') / 180;
    speed = 15 + 8*sin(theta*2) + 5*ranuni(42);
    x = speed * cos(theta);
    y = speed * sin(theta);
    output;
  end;
run;

proc template;
  define statgraph PolarPlot;
    begingraph;
      entrytitle "極座標グラフ: 風向・風速分布";
      layout overlay /
        xaxisopts=(display=none
          linearopts=(viewmin=-30 viewmax=30))
        yaxisopts=(display=none
          linearopts=(viewmin=-30 viewmax=30));
        /* 同心円グリッド */
        drawoval x=0 y=0 width=20 height=20 /
          display=(outline) outlineattrs=(color=lightgray);
        drawoval x=0 y=0 width=40 height=40 /
          display=(outline) outlineattrs=(color=lightgray);
        drawoval x=0 y=0 width=60 height=60 /
          display=(outline) outlineattrs=(color=lightgray);
        /* 方位ラベル */
        drawtext "N" / x=0 y=28 anchor=bottom
          textattrs=(size=10pt weight=bold);
        drawtext "E" / x=28 y=0 anchor=left
          textattrs=(size=10pt weight=bold);
        drawtext "S" / x=0 y=-28 anchor=top
          textattrs=(size=10pt weight=bold);
        drawtext "W" / x=-28 y=0 anchor=right
          textattrs=(size=10pt weight=bold);
        /* データ点と接続線 */
        seriesplot x=x y=y /
          lineattrs=(color=steelblue thickness=2);
        scatterplot x=x y=y /
          markerattrs=(symbol=circlefilled
            color=steelblue size=5);
      endlayout;
    endgraph;
  end;
run;

proc sgrender data=wind_data template=PolarPlot;
run;</code></pre>

<h2>グラフ76: ゲージ / スピードメーター</h2>
<p>ゲージグラフ（スピードメーター型）はKPIの達成度を直感的に表示します。GTLのARC描画とPOLYGONで針を表現します。</p>

<pre><code>/* ゲージ用データ */
data gauge_data;
  value = 73; /* 表示する値 (0-100) */
  pi = constant('pi');
  /* 針の角度（左端=pi, 右端=0 の半円） */
  needle_angle = pi - (value/100)*pi;
  /* 針の先端座標 */
  nx = 0.85 * cos(needle_angle);
  ny = 0.85 * sin(needle_angle);
  /* 針の根元（三角形） */
  bx1 = 0.05 * cos(needle_angle + pi/2);
  by1 = 0.05 * sin(needle_angle + pi/2);
  bx2 = 0.05 * cos(needle_angle - pi/2);
  by2 = 0.05 * sin(needle_angle - pi/2);
  output;
run;

/* 目盛り用データ */
data gauge_ticks;
  pi = constant('pi');
  do pct = 0 to 100 by 10;
    angle = pi - (pct/100)*pi;
    /* 外側目盛り */
    tx1 = 0.9 * cos(angle);
    ty1 = 0.9 * sin(angle);
    tx2 = 1.0 * cos(angle);
    ty2 = 1.0 * sin(angle);
    /* ラベル位置 */
    lx = 1.1 * cos(angle);
    ly = 1.1 * sin(angle);
    label = put(pct, 3.);
    output;
  end;
run;

proc template;
  define statgraph GaugeChart;
    begingraph;
      entrytitle "ゲージチャート: KPI達成率";
      layout overlay /
        xaxisopts=(display=none
          linearopts=(viewmin=-1.3 viewmax=1.3))
        yaxisopts=(display=none
          linearopts=(viewmin=-0.3 viewmax=1.3));
        /* 色付きアーク帯（赤→黄→緑） */
        drawarc x=0 y=0 radius=0.95 startangle=0
          endangle=60 /
          display=(fill) fillattrs=(color=red);
        drawarc x=0 y=0 radius=0.95 startangle=60
          endangle=120 /
          display=(fill) fillattrs=(color=gold);
        drawarc x=0 y=0 radius=0.95 startangle=120
          endangle=180 /
          display=(fill) fillattrs=(color=green);
        /* 目盛り */
        vectorplot x=tx2 y=ty2 xorigin=tx1 yorigin=ty1 /
          lineattrs=(color=black thickness=1);
        textplot x=lx y=ly text=label /
          textattrs=(size=8pt);
        /* 針（線として描画） */
        vectorplot x=nx y=ny xorigin=eval(0) yorigin=eval(0) /
          lineattrs=(color=darkred thickness=3);
        /* 中心点 */
        scatterplot x=eval(0) y=eval(0) /
          markerattrs=(symbol=circlefilled
            color=darkred size=12);
        /* 値ラベル */
        drawtext "73%" / x=0 y=-0.15
          textattrs=(size=16pt weight=bold color=darkred);
      endlayout;
    endgraph;
  end;
run;

proc sgrender data=gauge_ticks template=GaugeChart;
run;</code></pre>

<div class="info-box tip">
<div class="info-box-title">GTL描画プリミティブ</div>
<p>GTLでは以下の描画プリミティブが使用できます。</p>
<ul>
<li><strong>DRAWARC:</strong> 円弧の描画（ゲージの帯部分）</li>
<li><strong>DRAWOVAL:</strong> 楕円の描画（同心円グリッド）</li>
<li><strong>DRAWTEXT:</strong> 固定テキストの描画</li>
<li><strong>DRAWLINE:</strong> 直線の描画</li>
<li><strong>DRAWRECTANGLE:</strong> 矩形の描画</li>
</ul>
</div>
            `,
            quiz: [
                {
                    id: "q502_1",
                    type: "choice",
                    question: "極座標からXY座標への変換で、x座標を求める式はどれですか？",
                    options: ["x = r * sin(theta)", "x = r * cos(theta)", "x = r * tan(theta)", "x = r / cos(theta)"],
                    answer: 1,
                    explanation: "極座標から直交座標への変換は x = r * cos(theta), y = r * sin(theta) です。"
                },
                {
                    id: "q502_2",
                    type: "choice",
                    question: "レーダーチャートで5つの評価軸を等間隔に配置する場合、隣接する軸の角度差は？",
                    options: ["45度", "60度", "72度", "90度"],
                    answer: 2,
                    explanation: "360度 / 5 = 72度です。N個の軸の場合、角度差は360/N度になります。"
                },
                {
                    id: "q502_3",
                    type: "choice",
                    question: "GTLでゲージの色付きアーク帯を描画するために使用するプリミティブは？",
                    options: ["DRAWOVAL", "DRAWLINE", "DRAWARC", "DRAWRECTANGLE"],
                    answer: 2,
                    explanation: "DRAWARCで円弧を描画し、色分けしたゲージの帯を作成します。"
                },
                {
                    id: "q502_4",
                    type: "fill",
                    question: "SASで円周率の定数を取得する関数呼び出しは？（例: constant('xxx')のxxxを答えてください）",
                    answer: "pi",
                    explanation: "constant('pi')でSASの円周率定数（3.14159...）を取得できます。"
                }
            ]
        },
        {
            id: 503,
            title: "サンキー・ネットワーク・特殊（4種類）",
            duration: "15分",
            content: `
<h2>GTLによるフロー・ネットワーク系グラフ</h2>
<p>サンキーダイアグラムやネットワークグラフは、データの流れや関係性を可視化する高度なグラフです。GTLのPOLYGON、BAND、VECTOR、SCATTERを組み合わせて構築します。</p>

<h2>グラフ77: サンキーダイアグラム</h2>
<p>サンキーダイアグラムは、カテゴリ間の量的な流れを帯（バンド）の幅で表現するグラフです。POLYGON+BANDステートメントで流れを描画します。</p>

<pre><code>/* サンキーダイアグラム用フローデータ */
data sankey_flow;
  length source $12 target $12;
  input source $ target $ flow;
  datalines;
営業部 成約 150
営業部 失注 80
営業部 保留 50
マーケ 成約 120
マーケ 失注 60
マーケ 保留 40
紹介 成約 90
紹介 失注 20
紹介 保留 30
;
run;

/* ノード位置とフロー座標を計算するマクロ */
%macro sankey_prep(ds=, out=);
  proc sql noprint;
    /* 左ノード（ソース）の累積位置 */
    create table _src as
    select source,
      sum(flow) as total,
      sum(flow) as src_total
    from &ds group by source;

    /* 右ノード（ターゲット）の累積位置 */
    create table _tgt as
    select target,
      sum(flow) as total,
      sum(flow) as tgt_total
    from &ds group by target;
  quit;

  /* フローの帯（ポリゴン）座標生成 */
  data &out;
    set &ds;
    /* 左側x=0, 右側x=1 */
    /* 各フローを上下の座標で定義 */
    /* ベジェ曲線近似のため中間点を追加 */
    x1 = 0; x2 = 0.3; x3 = 0.7; x4 = 1.0;
    /* Y座標は累積値に基づいて計算 */
    output;
  run;
%mend;

/* GTLテンプレート */
proc template;
  define statgraph SankeyDiagram;
    begingraph;
      entrytitle "サンキーダイアグラム: リード獲得チャネル別成果";
      layout overlay /
        xaxisopts=(display=none
          linearopts=(viewmin=-0.2 viewmax=1.2))
        yaxisopts=(display=none);
        /* フローの帯 */
        bandplot x=x limitupper=upper limitlower=lower /
          group=flow_id
          fillattrs=(transparency=0.5)
          display=(fill);
        /* 左右のノード（バー） */
        highlowplot y=node_y low=node_low high=node_high /
          type=bar barwidth=0.08
          fillattrs=(color=gray);
        /* ノードラベル */
        textplot x=label_x y=label_y text=node_label /
          textattrs=(size=9pt weight=bold);
      endlayout;
    endgraph;
  end;
run;</code></pre>

<h2>グラフ78: アルビアルダイアグラム（状態遷移）</h2>
<p>アルビアルダイアグラムは、時間経過に伴うカテゴリ間の状態遷移を可視化します。サンキーの多段版として、各時点でのカテゴリ分布と遷移フローを表示します。</p>

<pre><code>/* 状態遷移データ（治療前→4週→8週） */
data alluvial_data;
  length time1 $8 time2 $8 time3 $8;
  input time1 $ time2 $ time3 $ count;
  datalines;
軽症 軽症 改善 30
軽症 中等症 中等症 10
軽症 改善 改善 25
中等症 軽症 改善 15
中等症 中等症 中等症 20
中等症 重症 重症 8
重症 中等症 改善 5
重症 重症 重症 12
重症 重症 中等症 7
;
run;

/* 各時点のノード位置と遷移帯を計算 */
data alluvial_plot;
  set alluvial_data;
  /* 3時点のx座標: 0, 0.5, 1.0 */
  /* 各カテゴリのy座標は累積度数で計算 */
  /* ポリゴン座標を生成して帯を描画 */
  array times{3} $ time1 time2 time3;
  do stage = 1 to 2;
    x_from = (stage - 1) * 0.5;
    x_to = stage * 0.5;
    source = times{stage};
    target = times{stage + 1};
    output;
  end;
run;

proc template;
  define statgraph AlluvialDiagram;
    begingraph;
      entrytitle "アルビアルダイアグラム: 治療経過の状態遷移";
      layout overlay /
        xaxisopts=(display=(tickvalues)
          linearopts=(tickvaluelist=(0 0.5 1.0)))
        yaxisopts=(display=none);
        bandplot x=x limitupper=upper limitlower=lower /
          group=flow_id
          fillattrs=(transparency=0.6)
          display=(fill);
        highlowplot y=node_y low=node_low high=node_high /
          type=bar barwidth=0.05
          fillattrs=(color=darkgray);
        textplot x=label_x y=label_y text=node_label /
          textattrs=(size=8pt weight=bold);
      endlayout;
    endgraph;
  end;
run;</code></pre>

<h2>グラフ79: ネットワークグラフ</h2>
<p>ネットワークグラフはノード（頂点）とエッジ（辺）の関係を可視化します。GTLのSCATTER+VECTOR+TEXTを組み合わせて構築します。</p>

<pre><code>/* ノードデータ（手動座標指定） */
data nodes;
  length node_id $8 label $20;
  input node_id $ x y size label $20.;
  datalines;
N1 0.5 0.9 30 統計解析部
N2 0.2 0.6 25 データMgmt
N3 0.8 0.6 25 モニタリング
N4 0.1 0.3 20 プログラミング
N5 0.5 0.3 20 QC
N6 0.9 0.3 20 安全性
N7 0.5 0.0 15 レポート
;
run;

/* エッジデータ */
data edges;
  length from_id $8 to_id $8;
  input from_id $ to_id $ weight;
  datalines;
N1 N2 5
N1 N3 4
N2 N4 3
N2 N5 3
N3 N5 2
N3 N6 4
N4 N7 2
N5 N7 3
N6 N7 2
;
run;

/* ノードとエッジを結合 */
data network_plot;
  merge edges(in=e)
    nodes(rename=(x=x_from y=y_from) where=(node_id=from_id))
    nodes(rename=(x=x_to y=y_to) where=(node_id=to_id));
  by from_id;
run;

proc template;
  define statgraph NetworkGraph;
    begingraph;
      entrytitle "ネットワークグラフ: 部門間連携";
      layout overlay /
        xaxisopts=(display=none
          linearopts=(viewmin=-0.1 viewmax=1.1))
        yaxisopts=(display=none
          linearopts=(viewmin=-0.1 viewmax=1.1));
        /* エッジ（矢印線） */
        vectorplot x=x_to y=y_to
          xorigin=x_from yorigin=y_from /
          lineattrs=(color=gray thickness=1)
          arrowheads=true;
        /* ノード（バブル） */
        bubbleplot x=x y=y size=size /
          fillattrs=(color=steelblue
            transparency=0.3)
          bradiusmax=20px;
        /* ノードラベル */
        textplot x=x y=y text=label /
          textattrs=(size=8pt weight=bold
            color=white);
      endlayout;
    endgraph;
  end;
run;

proc sgrender data=network_plot template=NetworkGraph;
run;</code></pre>

<h2>グラフ80: デンドログラム</h2>
<p>デンドログラム（樹形図）は階層的クラスタリングの結果を木構造で表現します。PROC CLUSTERの出力をGTLで描画します。</p>

<pre><code>/* クラスタリング実行 */
proc cluster data=sashelp.iris(where=(Species="Setosa"))
  method=ward outtree=tree_out noprint;
  var SepalLength SepalWidth PetalLength PetalWidth;
  id Species;
run;

/* デンドログラムをPROC TREEで描画（基本版） */
proc tree data=tree_out
  horizontal
  height=_height_;
  id _name_;
run;

/* GTL版: より高度なカスタマイズ */
/* ツリー出力データからノード座標を計算 */
data dendro_plot;
  set tree_out;
  /* 水平線と垂直線のセグメント座標を計算 */
  /* 各クラスタの結合高さ(_HEIGHT_)をY軸に使用 */
  /* リーフノードのX座標は等間隔に配置 */
run;

proc template;
  define statgraph Dendrogram;
    begingraph;
      entrytitle "デンドログラム: 階層的クラスタリング結果";
      layout overlay /
        xaxisopts=(label="サンプル"
          display=(tickvalues label))
        yaxisopts=(label="距離"
          linearopts=(viewmin=0));
        /* 水平結合線 */
        seriesplot x=hx y=hy / group=seg_id
          lineattrs=(color=steelblue thickness=2);
        /* 垂直結合線 */
        vectorplot x=vx2 y=vy2
          xorigin=vx1 yorigin=vy1 /
          arrowheads=false
          lineattrs=(color=steelblue thickness=2);
        /* リーフラベル */
        textplot x=leaf_x y=eval(0) text=leaf_label /
          textattrs=(size=7pt)
          rotate=90;
      endlayout;
    endgraph;
  end;
run;</code></pre>

<div class="info-box tip">
<div class="info-box-title">フローデータ準備のポイント</div>
<ul>
<li><strong>サンキー / アルビアル:</strong> フローの帯を描くには、上端・下端のY座標を累積値から計算する前処理が必要</li>
<li><strong>ネットワーク:</strong> ノード座標は手動指定か、力学モデル（Force-Directed）で自動計算</li>
<li><strong>デンドログラム:</strong> PROC CLUSTERのOUTTREE=出力データセットを座標データに変換する</li>
</ul>
</div>
            `,
            quiz: [
                {
                    id: "q503_1",
                    type: "choice",
                    question: "サンキーダイアグラムが表現するのは主にどのようなデータですか？",
                    options: ["時系列の変動", "カテゴリ間の量的フロー", "地理的分布", "相関関係"],
                    answer: 1,
                    explanation: "サンキーダイアグラムはカテゴリ間の量的な流れ（フロー）を帯の幅で表現するグラフです。"
                },
                {
                    id: "q503_2",
                    type: "choice",
                    question: "ネットワークグラフでノード間の接続線（エッジ）を描画するGTLステートメントは？",
                    options: ["SERIESPLOT", "VECTORPLOT", "BANDPLOT", "LINEPLOT"],
                    answer: 1,
                    explanation: "VECTORPLOTを使ってノード間に矢印付きの接続線（エッジ）を描画します。"
                },
                {
                    id: "q503_3",
                    type: "choice",
                    question: "デンドログラムを生成するために使用するSAS PROCはどれですか？",
                    options: ["PROC FACTOR", "PROC CLUSTER", "PROC TREE", "PROC CLUSTERとPROC TREEの両方"],
                    answer: 3,
                    explanation: "PROC CLUSTERでクラスタリングを実行し、PROC TREEでデンドログラムを描画します。両方を使用します。"
                },
                {
                    id: "q503_4",
                    type: "fill",
                    question: "アルビアルダイアグラムが可視化するのは、時間経過に伴うカテゴリ間の何ですか？（漢字4文字）",
                    answer: "状態遷移",
                    explanation: "アルビアルダイアグラムは時間経過に伴うカテゴリ間の状態遷移を可視化するグラフです。"
                }
            ]
        },
        {
            id: 504,
            title: "地図・コロプレス（4種類）",
            duration: "15分",
            content: `
<h2>SASによる地図グラフ</h2>
<p>SASには地図データライブラリ（MAPS.JAPAN, MAPS.USなど）が組み込まれており、<strong>PROC GMAP</strong>でコロプレスマップなどの地図グラフを作成できます。</p>

<div class="info-box tip">
<div class="info-box-title">PROC GMAPの基本構文</div>
<pre><code>proc gmap data=分析データ map=地図データ;
  id 結合キー;
  choro 色分け変数;
run;</code></pre>
</div>

<h2>グラフ81: コロプレスマップ</h2>
<p>コロプレスマップは、地域ごとにデータ値を色の濃淡で表現する塗り分け地図です。<strong>PROC GMAP</strong>のCHOROステートメントで作成します。</p>

<pre><code>/* 都道府県別データ */
data pref_data;
  input id population;
  datalines;
1 5224614
2 1237984
3 1210534
4 2301996
5 959502
13 14047594
14 9237337
23 7542415
27 8837685
40 5135214
;
run;

/* 日本地図のコロプレスマップ */
proc gmap data=pref_data map=maps.japan;
  id id;
  choro population /
    midpoints=5
    coutline=gray
    cempty=white
    legend=legend1;
  legend1 label=("人口");
run;
quit;</code></pre>

<div class="info-box formula">
<div class="info-box-title">PROC GMAPの主要オプション</div>
<table>
<tr><th>オプション</th><th>説明</th></tr>
<tr><td>COUTLINE=</td><td>境界線の色</td></tr>
<tr><td>CEMPTY=</td><td>データのない地域の塗り色</td></tr>
<tr><td>MIDPOINTS=</td><td>色分けの区切り数</td></tr>
<tr><td>DENSITY=</td><td>地図の詳細度（1=最も詳細、4=最も粗い）</td></tr>
<tr><td>LEVELS=</td><td>色の段階数</td></tr>
</table>
</div>

<h2>グラフ82: バブルマップ</h2>
<p>バブルマップは地図上にバブル（円）をオーバーレイし、各地域のデータ量を円の大きさで表現します。PROC GMAPとANNOTATEデータセット、またはGTLのSCATTER+POLYGONオーバーレイで作成します。</p>

<pre><code>/* 都道府県の中心座標とデータ */
data bubble_data;
  input id x y sales;
  datalines;
13 139.69 35.68 5000
27 135.50 34.69 3200
23 136.90 35.18 2800
14 139.64 35.44 2500
40 130.41 33.59 1800
;
run;

/* アノテーションでバブルを描画 */
data anno_bubble;
  set bubble_data;
  length function $8 color $8;
  xsys = '2'; ysys = '2';
  function = 'pie';
  style = 'psolid';
  color = 'steelblue';
  rotate = 360;
  size = sales / 500; /* サイズをデータに比例 */
  output;
  /* ラベルも追加 */
  function = 'label';
  color = 'black';
  text = put(sales, comma8.);
  size = 1.2;
  position = 'E';
  output;
run;

proc gmap data=pref_data map=maps.japan
  annotate=anno_bubble;
  id id;
  choro id /
    nolegend
    coutline=gray
    cempty=lightyellow
    levels=1;
run;
quit;

/* GTL版: SGPLOTオーバーレイ */
proc sgplot data=bubble_data noautolegend;
  bubble x=x y=y size=sales /
    fillattrs=(color=steelblue transparency=0.4)
    bradiusmax=30px
    bradiusmin=5px;
  text x=x y=y text=sales /
    textattrs=(size=8pt weight=bold);
  xaxis label="経度" values=(128 to 146 by 2);
  yaxis label="緯度" values=(30 to 46 by 2);
run;</code></pre>

<h2>グラフ83: ドットマップ</h2>
<p>ドットマップは個々のデータポイントを地図上の点として配置し、分布パターンを可視化します。SCATTERプロットにマップ境界線をオーバーレイします。</p>

<pre><code>/* 施設位置データ（緯度・経度） */
data facility_locations;
  length facility_type $12;
  input facility_type $ longitude latitude;
  datalines;
病院 139.77 35.68
病院 135.50 34.69
クリニック 136.91 35.17
クリニック 139.64 35.47
薬局 130.40 33.59
薬局 140.12 35.60
病院 141.35 43.06
クリニック 132.46 34.40
;
run;

/* SCATTERにマップオーバーレイ */
proc sgplot data=facility_locations;
  scatter x=longitude y=latitude /
    group=facility_type
    markerattrs=(symbol=circlefilled size=10);
  xaxis label="経度" grid
    values=(128 to 146 by 2);
  yaxis label="緯度" grid
    values=(30 to 46 by 2);
  keylegend / title="施設タイプ"
    location=inside position=topleft;
  title "ドットマップ: 治験施設分布";
run;</code></pre>

<h2>グラフ84: カートグラム</h2>
<p>カートグラムは、データ値に比例して地域の面積を変形させた地図です。人口や売上に応じてエリアサイズが拡大・縮小されます。SASでは直接的なカートグラム関数はないため、座標変換による近似アプローチを使用します。</p>

<pre><code>/* カートグラム用: 重心ベースの変形 */
/* 各地域の重心座標とスケーリング係数を計算 */
proc means data=maps.japan noprint;
  by id;
  var x y;
  output out=centroids mean=cx cy;
run;

/* データ値に基づくスケール係数 */
data scale_factors;
  merge centroids pref_data;
  by id;
  /* 人口に比例してスケール */
  max_pop = 14047594;
  scale = sqrt(population / max_pop) * 1.5 + 0.5;
run;

/* 地図座標をスケーリング */
data cartogram;
  merge maps.japan scale_factors(keep=id cx cy scale);
  by id;
  /* 重心からの距離をスケーリング */
  new_x = cx + (x - cx) * scale;
  new_y = cy + (y - cy) * scale;
run;

proc gmap data=pref_data map=cartogram;
  id id;
  choro population /
    midpoints=5
    coutline=black;
run;
quit;</code></pre>

<div class="info-box warning">
<div class="info-box-title">地図グラフの注意点</div>
<ul>
<li><strong>ID結合:</strong> データと地図のID変数が一致している必要がある</li>
<li><strong>MAPS.JAPANのID:</strong> 都道府県コード（1=北海道、13=東京 ... 47=沖縄）</li>
<li><strong>MAPS.USのID:</strong> FIPS州コード</li>
<li><strong>DENSITY=:</strong> 地図の詳細度。大きいほど粗くなり描画が高速に</li>
<li><strong>投影法:</strong> PROC GMAPのPROJECT=オプションで地図投影法を指定可能</li>
</ul>
</div>

<div class="info-box formula">
<div class="info-box-title">SAS地図データライブラリ（MAPS）</div>
<table>
<tr><th>データセット</th><th>内容</th></tr>
<tr><td>MAPS.JAPAN</td><td>日本の都道府県境界</td></tr>
<tr><td>MAPS.US</td><td>米国の州境界</td></tr>
<tr><td>MAPS.WORLD</td><td>世界各国の境界</td></tr>
<tr><td>MAPS.EUROPE</td><td>ヨーロッパ各国の境界</td></tr>
<tr><td>MAPS.COUNTIES</td><td>米国の郡境界</td></tr>
</table>
</div>
            `,
            quiz: [
                {
                    id: "q504_1",
                    type: "choice",
                    question: "PROC GMAPでコロプレスマップを作成するステートメントはどれですか？",
                    options: ["BLOCK", "CHORO", "PRISM", "SURFACE"],
                    answer: 1,
                    explanation: "CHOROステートメントでコロプレスマップ（塗り分け地図）を作成します。"
                },
                {
                    id: "q504_2",
                    type: "choice",
                    question: "PROC GMAPでデータが存在しない地域の色を指定するオプションは？",
                    options: ["COUTLINE=", "CEMPTY=", "CFILL=", "CMISSING="],
                    answer: 1,
                    explanation: "CEMPTY=オプションでデータが存在しない地域の塗り色を指定します。COUTLINE=は境界線の色です。"
                },
                {
                    id: "q504_3",
                    type: "choice",
                    question: "カートグラムの特徴として正しいものはどれですか？",
                    options: ["地形を3Dで表示する", "データ値に比例して地域の面積を変形させる", "等高線を表示する", "衛星画像をオーバーレイする"],
                    answer: 1,
                    explanation: "カートグラムはデータ値（人口や売上など）に比例して地域の面積を拡大・縮小させた変形地図です。"
                },
                {
                    id: "q504_4",
                    type: "fill",
                    question: "SASで日本の都道府県地図データが格納されているデータセット名は？（例: MAPS.xxx）",
                    answer: "MAPS.JAPAN",
                    explanation: "MAPS.JAPANに日本の都道府県境界データが格納されています。IDは都道府県コード（1-47）です。"
                }
            ]
        }
    ]
};
