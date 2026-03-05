/* ============================================
   Level 6: 臨床試験グラフと実践カスタマイズ
   ============================================ */
const LEVEL6_DATA = {
    id: 6,
    title: "臨床試験グラフと実践カスタマイズ",
    icon: "💉",
    description: "FDA/PMDA申請で必須の臨床試験グラフとスタイルカスタマイズを学ぶ",
    modules: [
        {
            id: 601,
            title: "臨床試験の安全性グラフ（5種類）",
            duration: "15分",
            content: `
<h2>臨床試験の安全性評価グラフ</h2>
<p>臨床試験の安全性評価では、有害事象（AE）の発生状況、患者の治療経過、検査値の推移などを可視化する必要があります。FDA/PMDAへの申請書類やCSR（治験総括報告書）で標準的に使用される5種類のグラフを学びます。</p>

<div class="info-box tip">
<div class="info-box-title">CDISC標準データとの連携</div>
<p>臨床試験グラフのデータは通常、CDISC標準（SDTM/ADaM）に準拠したデータセットから作成します。</p>
<ul>
<li><strong>ADSL:</strong> 被験者レベルデータ（人口統計学的特性）</li>
<li><strong>ADAE:</strong> 有害事象データ</li>
<li><strong>ADLB:</strong> 臨床検査データ</li>
<li><strong>ADTTE:</strong> Time-to-Event（生存時間）データ</li>
</ul>
</div>

<h2>グラフ85: スイマープロット</h2>
<p>スイマープロット（Swimmer Plot）は、各被験者の治療期間を横棒で表示し、イベント発生時点をマーカーで示すグラフです。<strong>HIGHLOW + SCATTER</strong>で構築します。</p>

<pre><code>/* スイマープロット用サンプルデータ */
data swimmer;
  length subjid $6 arm $10 response $4;
  input subjid $ arm $ duration response $ ae_time dlt_time;
  datalines;
S001 治療群 180 CR 45 .
S002 治療群 150 PR 30 120
S003 治療群 90 SD . 60
S004 治療群 200 CR 80 .
S005 治療群 60 PD . 40
S006 対照群 120 PR 55 .
S007 対照群 75 SD 20 50
S008 対照群 160 CR 90 .
S009 対照群 45 PD . 30
S010 対照群 130 PR 70 100
;
run;

/* 治療期間順にソート */
proc sort data=swimmer;
  by duration;
run;

data swimmer2;
  set swimmer;
  subj_order = _n_;
run;

proc sgplot data=swimmer2;
  highlow y=subj_order low=0 high=duration /
    type=bar group=response
    barwidth=0.6
    transparency=0.2;
  scatter y=subj_order x=ae_time /
    markerattrs=(symbol=diamondfilled
      color=red size=10)
    legendlabel="有害事象";
  scatter y=subj_order x=dlt_time /
    markerattrs=(symbol=starfilled
      color=orange size=12)
    legendlabel="DLT";
  refline 180 / axis=x
    lineattrs=(pattern=dash color=gray)
    label="目標治療期間";
  yaxis type=discrete label="被験者"
    values=(1 to 10 by 1);
  xaxis label="治療日数" grid;
  keylegend / title="奏効"
    location=outside position=bottom;
  title "スイマープロット: 治療期間と臨床イベント";
run;</code></pre>

<h2>グラフ86: バタフライチャート</h2>
<p>バタフライチャート（背中合わせ棒グラフ）は、2群の有害事象発生率を左右対称に表示し、直感的に比較できるグラフです。<strong>HBAR</strong>の正負値で実現します。</p>

<pre><code>/* 有害事象の2群比較データ */
data butterfly;
  length ae_term $20;
  input ae_term $20. trt_pct ctrl_pct;
  ctrl_neg = -ctrl_pct; /* 対照群は負の値 */
  datalines;
頭痛              25.3 18.7
悪心              22.1 15.4
倦怠感            18.5 12.8
下痢              15.2 10.1
発熱              12.8 8.5
関節痛            10.5 7.2
食欲不振          8.3 5.9
めまい            6.7 4.8
;
run;

proc sgplot data=butterfly;
  hbar ae_term / response=trt_pct
    fillattrs=(color=steelblue)
    legendlabel="治療群"
    barwidth=0.6
    datalabel datalabelattrs=(size=8pt);
  hbar ae_term / response=ctrl_neg
    fillattrs=(color=salmon)
    legendlabel="対照群"
    barwidth=0.6;
  refline 0 / axis=x
    lineattrs=(color=black thickness=2);
  xaxis label="発生率(%)"
    values=(-30 to 30 by 10)
    valuesdisplay=("30" "20" "10" "0"
      "10" "20" "30");
  yaxis label="有害事象" discreteorder=data;
  keylegend / location=outside position=bottom;
  title "バタフライチャート: 有害事象発生率の群間比較";
run;</code></pre>

<h2>グラフ87: トルネードチャート</h2>
<p>トルネードチャート（竜巻図）は、正負の値を持つ水平棒グラフで、2つの指標のバランスを比較します。有害事象のリスク差やオッズ比の表示に使用します。</p>

<pre><code>/* リスク差データ */
data tornado;
  length ae_term $20;
  input ae_term $20. risk_diff lower upper;
  datalines;
頭痛              6.6 2.1 11.1
悪心              6.7 1.8 11.6
倦怠感            5.7 1.2 10.2
下痢              5.1 0.8 9.4
発熱              4.3 0.5 8.1
関節痛            3.3 -0.2 6.8
食欲不振          2.4 -0.8 5.6
めまい            1.9 -1.0 4.8
;
run;

proc sort data=tornado;
  by descending risk_diff;
run;

proc sgplot data=tornado;
  highlow y=ae_term low=lower high=upper /
    type=bar
    fillattrs=(color=lightsteelblue)
    barwidth=0.5;
  scatter y=ae_term x=risk_diff /
    markerattrs=(symbol=diamondfilled
      color=navy size=10);
  refline 0 / axis=x
    lineattrs=(color=red thickness=2 pattern=dash)
    label="リスク差 = 0";
  xaxis label="リスク差 (%)" grid;
  yaxis label="有害事象" discreteorder=data;
  title "トルネードチャート: 有害事象リスク差と95%CI";
run;</code></pre>

<h2>グラフ88: 有害事象バブルプロット</h2>
<p>バブルプロットは発生率（X軸）、重症度（Y軸）、該当人数（バブルサイズ）の3次元情報を同時に表示します。</p>

<pre><code>/* 有害事象バブルプロットデータ */
data ae_bubble;
  length ae_term $20 severity $8;
  input ae_term $20. severity $ incidence n_subjects;
  datalines;
頭痛 Grade1 15.3 23
頭痛 Grade2 8.2 12
頭痛 Grade3 1.8 3
悪心 Grade1 12.1 18
悪心 Grade2 7.5 11
悪心 Grade3 2.5 4
倦怠感 Grade1 10.5 16
倦怠感 Grade2 5.8 9
倦怠感 Grade3 2.2 3
下痢 Grade1 8.7 13
下痢 Grade2 4.5 7
下痢 Grade3 2.0 3
;
run;

proc sgplot data=ae_bubble;
  bubble x=incidence y=ae_term size=n_subjects /
    group=severity
    bradiusmin=5px bradiusmax=25px
    transparency=0.3;
  xaxis label="発生率 (%)" grid;
  yaxis label="有害事象";
  keylegend / title="重症度"
    location=outside position=right;
  title "有害事象バブルプロット: 発生率 x 重症度 x 人数";
run;</code></pre>

<h2>グラフ89: スパゲッティプロット</h2>
<p>スパゲッティプロットは、各被験者の検査値経時変化を個別の折れ線で表示します。<strong>SERIES GROUP=</strong>で被験者ごとの線を描画し、全体の傾向と個別の変動を同時に把握できます。</p>

<pre><code>/* 検査値経時データ */
data spaghetti;
  do subjid = 1 to 20;
    baseline = 80 + 40*ranuni(subjid);
    do visit = 0 to 5;
      if visit = 0 then value = baseline;
      else value = baseline + visit*(-3 + 2*ranuni(subjid*100+visit))
        + 8*rannor(subjid*200+visit);
      week = visit * 4;
      output;
    end;
  end;
  format subjid z3.;
run;

proc sgplot data=spaghetti;
  series x=week y=value / group=subjid
    lineattrs=(thickness=1 pattern=solid)
    transparency=0.5
    name="individual";
  loess x=week y=value /
    lineattrs=(color=red thickness=3)
    nomarkers
    name="trend" legendlabel="平均トレンド";
  refline 80 / axis=y
    lineattrs=(pattern=dash color=gray)
    label="基準値上限";
  xaxis label="Week" values=(0 to 20 by 4);
  yaxis label="ALT (U/L)" grid;
  keylegend "trend" / location=inside
    position=topright;
  title "スパゲッティプロット: ALT経時推移（個別+トレンド）";
run;</code></pre>

<div class="info-box warning">
<div class="info-box-title">安全性報告での使用場面</div>
<ul>
<li><strong>スイマープロット:</strong> 個別被験者の治療経過とイベントの時系列関係を提示</li>
<li><strong>バタフライチャート:</strong> DSURやCSRの有害事象概要セクション</li>
<li><strong>トルネードチャート:</strong> 群間のリスク差を信頼区間付きで報告</li>
<li><strong>バブルプロット:</strong> 有害事象の多次元的な全体像の把握</li>
<li><strong>スパゲッティプロット:</strong> 肝機能検査値など安全性検査の個別推移を確認</li>
</ul>
</div>
            `,
            quiz: [
                {
                    id: "q601_1",
                    type: "choice",
                    question: "スイマープロットで治療期間の棒を描画するために使用するステートメントはどれですか？",
                    options: ["HBAR", "VBAR", "HIGHLOW", "BAND"],
                    answer: 2,
                    explanation: "HIGHLOWステートメントのTYPE=BARオプションで各被験者の治療期間を棒で描画します。"
                },
                {
                    id: "q601_2",
                    type: "choice",
                    question: "バタフライチャートで対照群のデータを左側に表示するために行う処理は？",
                    options: ["Y軸を反転する", "値を負の数にする", "別のグラフに分ける", "X軸とY軸を入れ替える"],
                    answer: 1,
                    explanation: "対照群の値を負の数に変換し、HBARで正負両方向の棒を描画することで左右対称のバタフライチャートを作成します。"
                },
                {
                    id: "q601_3",
                    type: "choice",
                    question: "スパゲッティプロットで個別の被験者ごとに線を描くために使用するオプションは？",
                    options: ["CATEGORY=", "BY=", "GROUP=", "CLASS="],
                    answer: 2,
                    explanation: "SERIESステートメントのGROUP=オプションで被験者ID（subjid）を指定し、個別の折れ線を描画します。"
                },
                {
                    id: "q601_4",
                    type: "fill",
                    question: "CDISCの有害事象解析データセットの略称は？（英大文字4文字）",
                    answer: "ADAE",
                    explanation: "ADAE（Analysis Dataset for Adverse Events）はCDISC ADaM標準の有害事象解析データセットです。"
                }
            ]
        },
        {
            id: 602,
            title: "臨床試験の有効性グラフ（5種類）",
            duration: "15分",
            content: `
<h2>臨床試験の有効性評価グラフ</h2>
<p>有効性評価では、治療効果の大きさ、経時変化、サブグループ間の一貫性などを可視化します。特にオンコロジー（がん領域）ではRECIST基準に基づくグラフが標準的に使用されます。</p>

<div class="info-box formula">
<div class="info-box-title">RECIST基準のカテゴリ</div>
<table>
<tr><th>カテゴリ</th><th>基準</th><th>色（慣例）</th></tr>
<tr><td>CR（完全奏効）</td><td>全標的病変の消失</td><td>青</td></tr>
<tr><td>PR（部分奏効）</td><td>30%以上の縮小</td><td>緑</td></tr>
<tr><td>SD（安定）</td><td>PRにもPDにも該当しない</td><td>黄</td></tr>
<tr><td>PD（進行）</td><td>20%以上の増大 or 新病変</td><td>赤</td></tr>
</table>
</div>

<h2>グラフ90: スパイダープロット（腫瘍サイズ変化率推移）</h2>
<p>スパイダープロットは各被験者の腫瘍サイズ変化率の経時推移を折れ線で表示し、RECIST基準線（-30%, +20%）を参照線として描画します。</p>

<pre><code>/* 腫瘍サイズ変化率データ */
data tumor_spider;
  do subjid = 1 to 15;
    base_change = -40 + 60*ranuni(subjid);
    do cycle = 0 to 6;
      if cycle = 0 then pct_change = 0;
      else pct_change = base_change * (1 - exp(-cycle/3))
        + 5*rannor(subjid*10+cycle);
      output;
    end;
  end;
  format subjid z3.;
run;

proc sgplot data=tumor_spider;
  series x=cycle y=pct_change / group=subjid
    lineattrs=(thickness=1.5)
    transparency=0.3;
  refline -30 / axis=y
    lineattrs=(color=green pattern=dash thickness=2)
    label="PR基準 (-30%)";
  refline 20 / axis=y
    lineattrs=(color=red pattern=dash thickness=2)
    label="PD基準 (+20%)";
  refline 0 / axis=y
    lineattrs=(color=gray pattern=dot);
  xaxis label="サイクル" integer
    values=(0 to 6 by 1);
  yaxis label="腫瘍サイズ変化率 (%)"
    values=(-100 to 80 by 20);
  title "スパイダープロット: 腫瘍サイズ変化率の経時推移";
run;</code></pre>

<h2>グラフ91: ウォーターフォールプロット（Best Overall Response）</h2>
<p>ウォーターフォールプロットは各被験者のBest Overall Response（最良総合効果）を降順に並べた棒グラフで、RECIST基準の色分けで表示します。</p>

<pre><code>/* ウォーターフォールデータ */
data waterfall;
  length bor $4;
  input subjid best_change bor $;
  datalines;
1 -100 CR
2 -85 CR
3 -72 PR
4 -65 PR
5 -55 PR
6 -48 PR
7 -35 PR
8 -22 SD
9 -15 SD
10 -8 SD
11 -3 SD
12 5 SD
13 12 SD
14 18 SD
15 25 PD
16 32 PD
17 45 PD
18 58 PD
;
run;

proc sort data=waterfall;
  by best_change;
run;

data waterfall2;
  set waterfall;
  order = _n_;
run;

proc sgplot data=waterfall2;
  vbar order / response=best_change
    group=bor
    grouporder=data
    barwidth=0.8;
  refline -30 / axis=y
    lineattrs=(color=green pattern=dash thickness=2)
    label="PR基準 (-30%)";
  refline 20 / axis=y
    lineattrs=(color=red pattern=dash thickness=2)
    label="PD基準 (+20%)";
  refline 0 / axis=y
    lineattrs=(color=black);
  styleattrs datacolors=(blue green gold red);
  xaxis display=none label="被験者";
  yaxis label="最大腫瘍縮小率 (%)"
    values=(-100 to 80 by 20);
  keylegend / title="Best Overall Response"
    location=outside position=bottom;
  title "ウォーターフォールプロット: Best Overall Response";
run;</code></pre>

<h2>グラフ92: Shift Table可視化（ヒートマップ）</h2>
<p>Shift Tableは、ベースラインから投与後への検査値カテゴリの移行を度数表で示す表です。<strong>HEATMAPPARM</strong>で色の濃淡によるヒートマップとして可視化します。</p>

<pre><code>/* Shift Tableデータ */
data shift_data;
  length baseline_cat $8 post_cat $8;
  input baseline_cat $ post_cat $ count;
  datalines;
正常 正常 85
正常 軽度異常 12
正常 中等度 3
正常 高度異常 0
軽度異常 正常 15
軽度異常 軽度異常 22
軽度異常 中等度 8
軽度異常 高度異常 2
中等度 正常 3
中等度 軽度異常 7
中等度 中等度 10
中等度 高度異常 5
高度異常 正常 0
高度異常 軽度異常 1
高度異常 中等度 3
高度異常 高度異常 8
;
run;

proc sgplot data=shift_data;
  heatmapparm x=post_cat y=baseline_cat
    colorresponse=count /
    colormodel=(white lightyellow gold orange red)
    outline;
  text x=post_cat y=baseline_cat text=count /
    textattrs=(size=12pt weight=bold);
  xaxis label="投与後カテゴリ"
    values=("正常" "軽度異常" "中等度" "高度異常");
  yaxis label="ベースラインカテゴリ"
    values=("高度異常" "中等度" "軽度異常" "正常");
  gradlegend / title="被験者数";
  title "Shift Table ヒートマップ: 検査値カテゴリ移行";
run;</code></pre>

<h2>グラフ93: サブグループフォレストプロット</h2>
<p>サブグループフォレストプロットは、各サブグループのハザード比（HR）とその95%信頼区間を表示し、治療効果の一貫性を評価するグラフです。<strong>HIGHLOW + SCATTER + TEXT</strong>で構築します。</p>

<pre><code>/* サブグループ解析結果データ */
data forest;
  length subgroup $24 category $16;
  input subgroup $24. category $16. hr lower upper n;
  datalines;
全体               全被験者        0.72 0.58 0.89 500
性別               男性            0.68 0.51 0.91 280
性別               女性            0.78 0.56 1.08 220
年齢               65歳未満        0.65 0.49 0.86 310
年齢               65歳以上        0.82 0.59 1.14 190
ECOG PS            0               0.60 0.43 0.84 200
ECOG PS            1               0.80 0.61 1.05 250
ECOG PS            2               0.95 0.55 1.64 50
前治療             あり            0.70 0.54 0.91 320
前治療             なし            0.76 0.54 1.07 180
;
run;

data forest2;
  set forest;
  order = 11 - _n_;
  hr_text = put(hr, 4.2) || " (" ||
    put(lower, 4.2) || "-" ||
    put(upper, 4.2) || ")";
run;

proc sgplot data=forest2 noautolegend;
  highlow y=order low=lower high=upper /
    lineattrs=(color=steelblue thickness=2);
  scatter y=order x=hr /
    markerattrs=(symbol=diamondfilled
      color=navy size=10);
  text y=order x=eval(0.2) text=subgroup /
    textattrs=(size=8pt) position=left;
  text y=order x=eval(0.25) text=category /
    textattrs=(size=8pt) position=right;
  text y=order x=eval(2.2) text=hr_text /
    textattrs=(size=7pt) position=right;
  refline 1 / axis=x
    lineattrs=(color=red pattern=dash thickness=2)
    label="HR = 1.0";
  xaxis label="ハザード比 (95% CI)"
    type=log logbase=2
    values=(0.3 0.5 0.7 1.0 1.5 2.0);
  yaxis display=none;
  title "サブグループフォレストプロット: ハザード比の一貫性評価";
run;</code></pre>

<h2>グラフ94: 累積イベントプロット</h2>
<p>累積イベントプロットは、イベントの累積発生率を階段関数で表示するグラフです。<strong>STEP</strong>ステートメントで描画します。</p>

<pre><code>/* 累積イベントデータ */
data cumulative_event;
  length arm $10;
  /* 治療群 */
  do arm = "治療群";
    do time = 0 to 52 by 1;
      cum_rate = 100 * (1 - exp(-0.003 * time));
      output;
    end;
  end;
  /* 対照群 */
  do arm = "対照群";
    do time = 0 to 52 by 1;
      cum_rate = 100 * (1 - exp(-0.005 * time));
      output;
    end;
  end;
run;

proc sgplot data=cumulative_event;
  step x=time y=cum_rate / group=arm
    lineattrs=(thickness=2)
    name="step";
  xaxis label="時間 (週)" grid
    values=(0 to 52 by 4);
  yaxis label="累積イベント発生率 (%)" grid
    values=(0 to 30 by 5);
  keylegend "step" / title="投与群"
    location=inside position=topleft;
  title "累積イベントプロット: 有害事象累積発生率";
run;</code></pre>

<div class="info-box tip">
<div class="info-box-title">臨床的意義のポイント</div>
<ul>
<li><strong>-30% / +20% 参照線:</strong> RECIST v1.1基準のPR/PD閾値。治療効果判定の根拠となる</li>
<li><strong>RECISTカテゴリ色分け:</strong> 学術論文やFDA審査資料で標準的な色使い</li>
<li><strong>フォレストプロットのHR=1線:</strong> HR&lt;1は治療群有利、HR&gt;1は対照群有利を示す</li>
<li><strong>Shift Table:</strong> 薬剤投与による検査値変動の全体像を把握するための標準ツール</li>
</ul>
</div>
            `,
            quiz: [
                {
                    id: "q602_1",
                    type: "choice",
                    question: "RECIST基準で部分奏効（PR）と判定される腫瘍縮小率の閾値は？",
                    options: ["10%以上の縮小", "20%以上の縮小", "30%以上の縮小", "50%以上の縮小"],
                    answer: 2,
                    explanation: "RECIST v1.1基準では、標的病変の径和が30%以上縮小した場合にPR（部分奏効）と判定されます。"
                },
                {
                    id: "q602_2",
                    type: "choice",
                    question: "フォレストプロットでHR(ハザード比)=0.72の場合、どのような解釈になりますか？",
                    options: ["治療効果なし", "治療群が28%リスク低減", "対照群が28%リスク低減", "治療群が72%リスク低減"],
                    answer: 1,
                    explanation: "HR=0.72は対照群と比較して治療群のイベントリスクが28%低い（1-0.72=0.28）ことを意味し、治療群に有利です。"
                },
                {
                    id: "q602_3",
                    type: "choice",
                    question: "Shift Tableをヒートマップで可視化するために使用するSGPLOTステートメントは？",
                    options: ["HEATMAP", "HEATMAPPARM", "BUBBLE", "SCATTER"],
                    answer: 1,
                    explanation: "HEATMAPPARMステートメントでX, Y, COLORRESPONSEを指定してヒートマップ形式のShift Tableを作成します。"
                },
                {
                    id: "q602_4",
                    type: "fill",
                    question: "ウォーターフォールプロットで表示する指標の英語略称は？（3文字: Best ○○○）",
                    answer: "BOR",
                    explanation: "BOR（Best Overall Response）は各被験者の試験期間中の最良総合効果で、ウォーターフォールプロットの主指標です。"
                }
            ]
        },
        {
            id: 603,
            title: "スタイルとテーマのカスタマイズ（3種類）",
            duration: "15分",
            content: `
<h2>ODSスタイルとグラフカスタマイズ</h2>
<p>SASグラフの見た目はODSスタイルによって制御されます。既定のスタイルをベースにカスタマイズしたり、データ属性マッピングでグループ色を固定したりすることで、統一感のある高品質なグラフを作成できます。</p>

<h2>グラフ95: カスタムODSスタイル</h2>
<p><strong>PROC TEMPLATE DEFINE STYLE</strong>で独自のODSスタイルを定義します。既存スタイルを親として継承し、必要な部分だけカスタマイズします。</p>

<pre><code>/* カスタムスタイルの定義 */
proc template;
  define style Styles.MyJournal;
    parent = styles.journal;

    /* 全体のフォント設定 */
    class fonts /
      'TitleFont2' = ("Arial", 12pt, Bold)
      'TitleFont' = ("Arial", 14pt, Bold)
      'StrongFont' = ("Arial", 10pt, Bold)
      'EmphasisFont' = ("Arial", 10pt, Italic)
      'docFont' = ("Arial", 9pt);

    /* グラフの背景色 */
    class GraphWalls /
      frameborder = off
      contrastcolor = black
      color = white;

    class GraphBackground /
      color = white;

    /* グラフのデータカラー（カラーユニバーサルデザイン対応） */
    class GraphData1 /
      color = cx0072B2
      contrastcolor = cx0072B2
      markersymbol = "circlefilled";
    class GraphData2 /
      color = cxD55E00
      contrastcolor = cxD55E00
      markersymbol = "squarefilled";
    class GraphData3 /
      color = cx009E73
      contrastcolor = cx009E73
      markersymbol = "trianglefilled";
    class GraphData4 /
      color = cxF0E442
      contrastcolor = cxF0E442
      markersymbol = "diamondfilled";
    class GraphData5 /
      color = cxCC79A7
      contrastcolor = cxCC79A7
      markersymbol = "starfilled";

    /* 軸の設定 */
    class GraphAxisLines /
      contrastcolor = black
      color = black;

    class GraphGridLines /
      contrastcolor = lightgray
      color = lightgray;
  end;
run;

/* カスタムスタイルを適用 */
ods html5 style=Styles.MyJournal;

proc sgplot data=sashelp.class;
  scatter x=Height y=Weight / group=Sex
    markerattrs=(size=10);
  xaxis label="身長 (cm)";
  yaxis label="体重 (kg)";
  title "カスタムスタイル適用例";
run;

ods html5 close;</code></pre>

<div class="info-box formula">
<div class="info-box-title">SAS標準スタイル一覧</div>
<table>
<tr><th>スタイル名</th><th>特徴</th><th>用途</th></tr>
<tr><td>STYLES.JOURNAL</td><td>白黒ベース、学術論文向け</td><td>論文・学会発表</td></tr>
<tr><td>STYLES.LISTING</td><td>クラシックなSAS出力</td><td>ログ確認</td></tr>
<tr><td>STYLES.HTMLBLUE</td><td>青系カラー、Web向け</td><td>HTML出力</td></tr>
<tr><td>STYLES.PEARL</td><td>淡色パステル系</td><td>プレゼン</td></tr>
<tr><td>STYLES.STATISTICAL</td><td>統計解析向け最適化</td><td>統計出力</td></tr>
</table>
</div>

<h2>グラフ96: データ属性マッピング（DATTRMAP + ATTRID）</h2>
<p>データ属性マッピングは、グループ変数の値と色・マーカーの対応を<strong>固定</strong>するための仕組みです。DATTRMAPデータセットを作成し、ATTRIDオプションで参照します。</p>

<pre><code>/* データ属性マッピングテーブル */
data myattrmap;
  length value $10 fillcolor $12 linecolor $12
    markercolor $12 markersymbol $20;
  input value $ fillcolor $ linecolor $
    markercolor $ markersymbol $;
  id = "mymap"; /* ATTRID */
  datalines;
CR blue blue blue circlefilled
PR green green green squarefilled
SD gold gold gold trianglefilled
PD red red red diamondfilled
;
run;

/* マッピングを適用したグラフ */
proc sgplot data=waterfall2 dattrmap=myattrmap;
  vbar order / response=best_change
    group=bor
    attrid=mymap
    barwidth=0.8;
  refline -30 / axis=y
    lineattrs=(color=green pattern=dash);
  refline 20 / axis=y
    lineattrs=(color=red pattern=dash);
  xaxis display=none;
  yaxis label="最大腫瘍縮小率 (%)";
  keylegend / title="BOR";
  title "DATTRMAP使用: 固定色ウォーターフォール";
run;</code></pre>

<div class="info-box tip">
<div class="info-box-title">DATTRMAP vs STYLEATTRS</div>
<ul>
<li><strong>STYLEATTRS:</strong> グラフ内でグループ色を直接指定。簡単だがデータ値の順序に依存</li>
<li><strong>DATTRMAP + ATTRID:</strong> 値と色の対応をデータセットで定義。データ値の順序に関係なく常に同じ色を割り当て</li>
<li><strong>推奨:</strong> 複数のグラフで色の一貫性を保つ場合はDATTRMAPを使用</li>
</ul>
</div>

<h2>グラフ97: 凡例・軸・フォント完全カスタマイズ</h2>
<p>SGPLOT/SGPANELの軸、凡例、フォント、注釈を細かくカスタマイズし、出版品質のグラフを作成します。</p>

<pre><code>proc sgplot data=sashelp.class;
  /* データプロット */
  scatter x=Height y=Weight / group=Sex
    markerattrs=(size=12)
    name="scatter";

  /* X軸の完全カスタマイズ */
  xaxis label="身長 (cm)"
    labelattrs=(size=11pt weight=bold
      family="Arial")
    values=(50 to 75 by 5)
    valueattrs=(size=9pt)
    grid gridattrs=(color=lightgray pattern=dot)
    offsetmin=0.05 offsetmax=0.05
    minor minorgrid;

  /* Y軸の完全カスタマイズ */
  yaxis label="体重 (kg)"
    labelattrs=(size=11pt weight=bold
      family="Arial")
    values=(50 to 150 by 20)
    valueattrs=(size=9pt)
    grid gridattrs=(color=lightgray pattern=dot)
    offsetmin=0.05 offsetmax=0.05;

  /* 凡例のカスタマイズ */
  keylegend "scatter" /
    title="性別"
    titleattrs=(size=10pt weight=bold)
    valueattrs=(size=9pt)
    location=inside
    position=topright
    across=1
    opaque
    border;

  /* グラフ内テキスト注釈 */
  inset "N = 19" / position=bottomleft
    textattrs=(size=9pt color=gray)
    border;

  /* タイトルとフットノート */
  title height=14pt bold "身長と体重の関係";
  footnote height=8pt italic
    "データ出典: sashelp.class";
run;
footnote;</code></pre>

<div class="info-box formula">
<div class="info-box-title">カスタマイズ主要オプション一覧</div>
<table>
<tr><th>カテゴリ</th><th>オプション</th><th>説明</th></tr>
<tr><td>軸ラベル</td><td>LABELATTRS=(SIZE= WEIGHT= FAMILY=)</td><td>ラベルのフォント属性</td></tr>
<tr><td>軸値</td><td>VALUES= VALUEATTRS= VALUESDISPLAY=</td><td>目盛り値とそのフォント</td></tr>
<tr><td>グリッド</td><td>GRID GRIDATTRS=(COLOR= PATTERN=)</td><td>グリッド線の表示と属性</td></tr>
<tr><td>凡例</td><td>KEYLEGEND / TITLE= LOCATION= POSITION=</td><td>凡例の配置と書式</td></tr>
<tr><td>注釈</td><td>INSET / POSITION= TEXTATTRS= BORDER</td><td>グラフ内テキスト</td></tr>
<tr><td>グループ色</td><td>STYLEATTRS DATACOLORS=() DATACONTRASTCOLORS=()</td><td>グループの色指定</td></tr>
<tr><td>優先順位</td><td>ATTRPRIORITY=COLOR|NONE CYCLEATTRS</td><td>色・マーカーの循環順序</td></tr>
</table>
</div>

<div class="info-box tip">
<div class="info-box-title">カラーユニバーサルデザインの推奨色</div>
<p>色覚多様性に配慮した配色（Wong 2011に基づく）:</p>
<ul>
<li><strong>cx0072B2</strong> - 青（Blue）</li>
<li><strong>cxD55E00</strong> - 朱色（Vermillion）</li>
<li><strong>cx009E73</strong> - 緑（Bluish Green）</li>
<li><strong>cxF0E442</strong> - 黄（Yellow）</li>
<li><strong>cxCC79A7</strong> - ピンク（Reddish Purple）</li>
<li><strong>cx56B4E9</strong> - 空色（Sky Blue）</li>
<li><strong>cxE69F00</strong> - オレンジ（Orange）</li>
</ul>
</div>
            `,
            quiz: [
                {
                    id: "q603_1",
                    type: "choice",
                    question: "カスタムODSスタイルを定義する正しい構文は？",
                    options: [
                        "PROC STYLE; DEFINE MyStyle; ... END; RUN;",
                        "PROC TEMPLATE; DEFINE STYLE MyStyle; ... END; RUN;",
                        "PROC ODS; CREATE STYLE MyStyle; ... END; RUN;",
                        "PROC FORMAT; DEFINE STYLE MyStyle; ... END; RUN;"
                    ],
                    answer: 1,
                    explanation: "PROC TEMPLATE内のDEFINE STYLEステートメントでカスタムODSスタイルを定義します。"
                },
                {
                    id: "q603_2",
                    type: "choice",
                    question: "DATTRMAPを使う最大の利点は何ですか？",
                    options: [
                        "グラフの描画速度が向上する",
                        "データ値の順序に関係なく常に同じ色が割り当てられる",
                        "自動的にカラーユニバーサルデザインが適用される",
                        "凡例が自動生成される"
                    ],
                    answer: 1,
                    explanation: "DATTRMAPはデータ値と色の対応を固定するため、データの並び順やサブセットに関係なく常に一貫した色分けが実現できます。"
                },
                {
                    id: "q603_3",
                    type: "choice",
                    question: "学術論文向けの白黒ベースSAS標準スタイルはどれですか？",
                    options: ["STYLES.HTMLBLUE", "STYLES.PEARL", "STYLES.JOURNAL", "STYLES.STATISTICAL"],
                    answer: 2,
                    explanation: "STYLES.JOURNALは白黒ベースの学術論文・学会発表向けスタイルです。"
                },
                {
                    id: "q603_4",
                    type: "fill",
                    question: "SGPLOTでグループの色を直接指定するステートメントは？（英大文字で）",
                    answer: "STYLEATTRS",
                    explanation: "STYLEATTRSステートメントのDATACOLORS=オプションでグループ色を直接指定できます。"
                }
            ]
        },
        {
            id: 604,
            title: "ODS出力とダッシュボード（3種類+全100種類まとめ）",
            duration: "15分",
            content: `
<h2>ODS出力によるグラフ管理</h2>
<p>SASグラフの最終出力はODS（Output Delivery System）を通じて行います。出力先の選択、複数グラフの配置、高解像度設定、アニメーション生成など、実務で必須の技術を学びます。</p>

<h2>グラフ98: ODS LAYOUT GRIDDED（格子配置）</h2>
<p>ODS LAYOUT GRIDDEDは、複数のグラフや表を格子状に配置してダッシュボード的な出力を作成します。</p>

<pre><code>ods html5 file="dashboard_grid.html"
  style=htmlblue;
ods graphics / width=400px height=300px;

ods layout gridded columns=2;

  ods region;
  proc sgplot data=sashelp.class;
    vbar Sex / response=Height stat=mean
      fillattrs=(color=steelblue);
    yaxis label="平均身長";
    title "平均身長（性別）";
  run;

  ods region;
  proc sgplot data=sashelp.class;
    vbar Sex / response=Weight stat=mean
      fillattrs=(color=salmon);
    yaxis label="平均体重";
    title "平均体重（性別）";
  run;

  ods region;
  proc sgplot data=sashelp.class;
    scatter x=Height y=Weight / group=Sex
      markerattrs=(size=10);
    title "身長 vs 体重";
  run;

  ods region;
  proc sgplot data=sashelp.class;
    histogram Height;
    density Height;
    title "身長の分布";
  run;

ods layout end;
ods html5 close;</code></pre>

<h2>グラフ99: ODS LAYOUT ABSOLUTE（座標指定配置）</h2>
<p>ODS LAYOUT ABSOLUTEは、各グラフの位置（X, Y座標）とサイズを個別に指定して自由に配置します。</p>

<pre><code>ods pdf file="dashboard_abs.pdf"
  style=journal;

ods layout absolute;

  ods region x=0.5in y=0.5in
    width=4in height=3in;
  proc sgplot data=sashelp.class;
    scatter x=Height y=Weight / group=Sex;
    title "メイングラフ: 散布図";
  run;

  ods region x=5in y=0.5in
    width=2.5in height=2in;
  proc sgplot data=sashelp.class;
    vbar Sex / stat=freq
      fillattrs=(color=steelblue);
    title "性別分布";
  run;

  ods region x=5in y=2.8in
    width=2.5in height=1.5in;
  proc print data=sashelp.class(obs=5) noobs;
    var Name Sex Age Height Weight;
    title "サンプルデータ（先頭5件）";
  run;

  ods region x=0.5in y=4in
    width=7in height=0.5in;
  proc odstext;
    p "出力日: &sysdate  |  データ: SASHELP.CLASS  |  N=19"
      / style={fontsize=8pt color=gray};
  run;

ods layout end;
ods pdf close;</code></pre>

<h2>グラフ100: アニメーションGIF</h2>
<p>ODS HTML5とSGANIMATEを使って、グラフのアニメーションGIFを作成できます。時系列データの変化やパラメータの推移を動的に表現します。</p>

<pre><code>/* アニメーション用データ */
data animation_data;
  do frame = 1 to 20;
    do x = -3 to 3 by 0.1;
      y = sin(x + frame/3) * exp(-x**2/10);
      output;
    end;
  end;
run;

/* アニメーションGIF出力 */
ods html5 path="." file="wave_animation.html"
  options(bitmap_mode='inline');
ods graphics / imagefmt=gif
  width=600px height=400px;

proc sgplot data=animation_data(where=(frame=1))
  sganimate=animation_data
  animduration=0.2
  animloop=yes;
  series x=x y=y /
    lineattrs=(color=steelblue thickness=3);
  xaxis label="X" values=(-3 to 3 by 1);
  yaxis label="Y" values=(-1 to 1 by 0.2);
  title "波形アニメーション";
run;

ods html5 close;

/* 別の方法: BY変数でフレーム制御 */
ods graphics / imagefmt=gif
  outputfmt=gif animduration=0.3
  animloop=yes;

ods html5 gpath="." file="scatter_anim.html";

proc sgplot data=animation_data;
  by frame;
  series x=x y=y /
    lineattrs=(color=steelblue thickness=2);
  xaxis values=(-3 to 3 by 1);
  yaxis values=(-1 to 1 by 0.5);
run;

ods html5 close;</code></pre>

<div class="info-box formula">
<div class="info-box-title">ODS出力先比較</div>
<table>
<tr><th>出力先</th><th>形式</th><th>用途</th></tr>
<tr><td>ODS HTML5</td><td>HTML/SVG</td><td>Web、インタラクティブ</td></tr>
<tr><td>ODS PDF</td><td>PDF</td><td>印刷、申請書類</td></tr>
<tr><td>ODS RTF</td><td>Word</td><td>報告書</td></tr>
<tr><td>ODS LISTING</td><td>テキスト</td><td>ログ確認</td></tr>
<tr><td>ODS GRAPHICS</td><td>PNG/SVG/EMF</td><td>画像出力</td></tr>
</table>
</div>

<div class="info-box tip">
<div class="info-box-title">高品質出力の設定</div>
<pre><code>/* 高解像度PNG出力 */
ods graphics / reset=all
  imagefmt=png
  width=8in height=6in
  imagedpi=300
  antialiasmax=10000
  noborder;

/* 透過背景SVG出力 */
ods graphics / reset=all
  imagefmt=svg
  width=800px height=600px
  noborder;

/* EMF出力（PowerPoint貼り付け用） */
ods graphics / reset=all
  imagefmt=emf
  width=6in height=4.5in
  imagedpi=300;</code></pre>
</div>

<h2>全100種類のSASグラフまとめ</h2>
<p>本アカデミーで学んだ全100種類のSASグラフを一覧で整理します。</p>

<div class="visual-box">
<div class="visual-box-title">全100種類 SASグラフカタログ</div>
<table>
<tr><th>#</th><th>グラフ名</th><th>PROC / ステートメント</th><th>カテゴリ</th><th>Level</th></tr>
<tr><td>1</td><td>縦棒グラフ</td><td>SGPLOT VBAR</td><td>基本</td><td>1</td></tr>
<tr><td>2</td><td>横棒グラフ</td><td>SGPLOT HBAR</td><td>基本</td><td>1</td></tr>
<tr><td>3</td><td>積み上げ棒グラフ</td><td>SGPLOT VBAR GROUP=</td><td>基本</td><td>1</td></tr>
<tr><td>4</td><td>グループ化棒グラフ</td><td>SGPLOT VBAR GROUPDISPLAY=CLUSTER</td><td>基本</td><td>1</td></tr>
<tr><td>5</td><td>折れ線グラフ</td><td>SGPLOT SERIES</td><td>基本</td><td>1</td></tr>
<tr><td>6</td><td>面グラフ</td><td>SGPLOT BAND</td><td>基本</td><td>1</td></tr>
<tr><td>7</td><td>散布図</td><td>SGPLOT SCATTER</td><td>基本</td><td>1</td></tr>
<tr><td>8</td><td>バブルチャート</td><td>SGPLOT BUBBLE</td><td>基本</td><td>1</td></tr>
<tr><td>9</td><td>円グラフ</td><td>GCHART PIE / SGPIE</td><td>基本</td><td>1</td></tr>
<tr><td>10</td><td>ドーナツチャート</td><td>SGPIE DONUT</td><td>基本</td><td>1</td></tr>
<tr><td>11</td><td>パレート図</td><td>SGPLOT VBAR+SERIES</td><td>基本</td><td>1</td></tr>
<tr><td>12</td><td>ウォーターフォールチャート</td><td>SGPLOT WATERFALL</td><td>基本</td><td>1</td></tr>
<tr><td>13</td><td>ベン図</td><td>GTL / ANNOTATE</td><td>基本</td><td>1</td></tr>
<tr><td>14</td><td>ツリーマップ</td><td>GTL POLYGON</td><td>基本</td><td>1</td></tr>
<tr><td>15</td><td>ワードクラウド</td><td>GTL TEXT (サイズ可変)</td><td>基本</td><td>1</td></tr>
<tr><td>16</td><td>ブレットチャート</td><td>SGPLOT HIGHLOW+REFLINE</td><td>基本</td><td>1</td></tr>
<tr><td>17</td><td>ロリポップチャート</td><td>SGPLOT NEEDLE+SCATTER</td><td>基本</td><td>1</td></tr>
<tr><td>18</td><td>ヒストグラム</td><td>SGPLOT HISTOGRAM</td><td>分布</td><td>2</td></tr>
<tr><td>19</td><td>密度プロット</td><td>SGPLOT DENSITY</td><td>分布</td><td>2</td></tr>
<tr><td>20</td><td>箱ひげ図</td><td>SGPLOT VBOX/HBOX</td><td>分布</td><td>2</td></tr>
<tr><td>21</td><td>バイオリンプロット</td><td>SGPLOT+DENSITY左右反転</td><td>分布</td><td>2</td></tr>
<tr><td>22</td><td>ストリッププロット</td><td>SGPLOT SCATTER (JITTER)</td><td>分布</td><td>2</td></tr>
<tr><td>23</td><td>ビースウォームプロット</td><td>SGPLOT SCATTER+マクロ</td><td>分布</td><td>2</td></tr>
<tr><td>24</td><td>リッジラインプロット</td><td>SGPLOT BAND重ね描き</td><td>分布</td><td>2</td></tr>
<tr><td>25</td><td>Q-Qプロット</td><td>SGPLOT SCATTER+LINEPARM</td><td>統計</td><td>2</td></tr>
<tr><td>26</td><td>P-Pプロット</td><td>SGPLOT SCATTER+LINEPARM</td><td>統計</td><td>2</td></tr>
<tr><td>27</td><td>回帰直線付き散布図</td><td>SGPLOT SCATTER+REG</td><td>統計</td><td>2</td></tr>
<tr><td>28</td><td>LOESS平滑化曲線</td><td>SGPLOT LOESS</td><td>統計</td><td>2</td></tr>
<tr><td>29</td><td>PBSPLINE平滑化曲線</td><td>SGPLOT PBSPLINE</td><td>統計</td><td>2</td></tr>
<tr><td>30</td><td>相関行列ヒートマップ</td><td>SGPLOT HEATMAPPARM</td><td>統計</td><td>2</td></tr>
<tr><td>31</td><td>信頼区間付きバー</td><td>SGPLOT VBAR+HIGHLOW</td><td>比較</td><td>2</td></tr>
<tr><td>32</td><td>エラーバー付き折れ線</td><td>SGPLOT SERIES+HIGHLOW</td><td>比較</td><td>2</td></tr>
<tr><td>33</td><td>ダンベルチャート</td><td>SGPLOT HIGHLOW+SCATTER</td><td>比較</td><td>2</td></tr>
<tr><td>34</td><td>スロープチャート</td><td>SGPLOT SERIES(2時点)</td><td>比較</td><td>2</td></tr>
<tr><td>35</td><td>ヒートマップ</td><td>SGPLOT HEATMAP/HEATMAPPARM</td><td>分布</td><td>3</td></tr>
<tr><td>36</td><td>等高線図</td><td>SGPLOT CONTOURPLOTPARM</td><td>分布</td><td>3</td></tr>
<tr><td>37</td><td>2Dビン散布図</td><td>SGPLOT HEATMAP(BIN)</td><td>分布</td><td>3</td></tr>
<tr><td>38</td><td>マージナルヒストグラム付き散布図</td><td>SGPLOT+LAYOUT</td><td>複合</td><td>3</td></tr>
<tr><td>39</td><td>ペアプロット（散布図行列）</td><td>SGSCATTER MATRIX</td><td>複合</td><td>3</td></tr>
<tr><td>40</td><td>階段グラフ</td><td>SGPLOT STEP</td><td>時系列</td><td>3</td></tr>
<tr><td>41</td><td>面積グラフ（積み上げ）</td><td>SGPLOT BAND GROUP=</td><td>時系列</td><td>3</td></tr>
<tr><td>42</td><td>株価チャート（OHLC）</td><td>SGPLOT HIGHLOW</td><td>時系列</td><td>3</td></tr>
<tr><td>43</td><td>ローソク足チャート</td><td>SGPLOT HIGHLOW+VBAR</td><td>時系列</td><td>3</td></tr>
<tr><td>44</td><td>スパークライン</td><td>SGPLOT SERIES(小型)</td><td>時系列</td><td>3</td></tr>
<tr><td>45</td><td>カレンダーヒートマップ</td><td>SGPLOT HEATMAPPARM</td><td>時系列</td><td>3</td></tr>
<tr><td>46</td><td>ガントチャート</td><td>SGPLOT HIGHLOW</td><td>時系列</td><td>3</td></tr>
<tr><td>47</td><td>マリメッコチャート</td><td>SGPLOT POLYGON</td><td>複合</td><td>3</td></tr>
<tr><td>48</td><td>ピラミッドチャート</td><td>SGPLOT HBAR(正負値)</td><td>複合</td><td>3</td></tr>
<tr><td>49</td><td>Kaplan-Meier生存曲線</td><td>LIFETEST PLOTS=SURVIVAL</td><td>統計</td><td>3</td></tr>
<tr><td>50</td><td>フォレストプロット</td><td>SGPLOT HIGHLOW+SCATTER</td><td>統計</td><td>3</td></tr>
<tr><td>51</td><td>ファンネルプロット</td><td>SGPLOT SCATTER+BAND</td><td>統計</td><td>3</td></tr>
<tr><td>52</td><td>パネル基本（分類変数別）</td><td>SGPANEL PANELBY</td><td>パネル</td><td>4</td></tr>
<tr><td>53</td><td>パネル格子レイアウト</td><td>SGPANEL LAYOUT=LATTICE</td><td>パネル</td><td>4</td></tr>
<tr><td>54</td><td>パネル行配置</td><td>SGPANEL LAYOUT=ROWLATTICE</td><td>パネル</td><td>4</td></tr>
<tr><td>55</td><td>パネル列配置</td><td>SGPANEL LAYOUT=COLUMNLATTICE</td><td>パネル</td><td>4</td></tr>
<tr><td>56</td><td>トレリスプロット</td><td>SGPANEL 2変数PANELBY</td><td>パネル</td><td>4</td></tr>
<tr><td>57</td><td>パネルヒストグラム</td><td>SGPANEL HISTOGRAM PANELBY</td><td>パネル</td><td>4</td></tr>
<tr><td>58</td><td>パネル箱ひげ図</td><td>SGPANEL VBOX PANELBY</td><td>パネル</td><td>4</td></tr>
<tr><td>59</td><td>パネル回帰比較</td><td>SGPANEL REG PANELBY</td><td>パネル</td><td>4</td></tr>
<tr><td>60</td><td>正規確率プロット</td><td>UNIVARIATE PLOTS=PROBPLOT</td><td>統計PRC</td><td>4</td></tr>
<tr><td>61</td><td>診断プロットパネル</td><td>REG PLOTS=DIAGNOSTICS</td><td>統計PRC</td><td>4</td></tr>
<tr><td>62</td><td>残差 vs 予測値</td><td>REG PLOTS=RESIDUALBYPREDICTED</td><td>統計PRC</td><td>4</td></tr>
<tr><td>63</td><td>偏回帰プロット</td><td>REG PLOTS=PARTIAL</td><td>統計PRC</td><td>4</td></tr>
<tr><td>64</td><td>Cookの距離プロット</td><td>REG PLOTS=COOKSD</td><td>統計PRC</td><td>4</td></tr>
<tr><td>65</td><td>主成分プロット</td><td>PRINCOMP PLOTS=SCORE</td><td>多変量</td><td>4</td></tr>
<tr><td>66</td><td>バイプロット</td><td>PRINCOMP PLOTS=PATTERN</td><td>多変量</td><td>4</td></tr>
<tr><td>67</td><td>クラスターデンドログラム</td><td>CLUSTER+TREE</td><td>多変量</td><td>4</td></tr>
<tr><td>68</td><td>判別分析プロット</td><td>DISCRIM PLOTS=ALL</td><td>多変量</td><td>4</td></tr>
<tr><td>69</td><td>オーバーレイレイアウト</td><td>GTL LAYOUT OVERLAY</td><td>GTL</td><td>5</td></tr>
<tr><td>70</td><td>格子レイアウト</td><td>GTL LAYOUT LATTICE</td><td>GTL</td><td>5</td></tr>
<tr><td>71</td><td>グリッドレイアウト</td><td>GTL LAYOUT GRIDDED</td><td>GTL</td><td>5</td></tr>
<tr><td>72</td><td>データパネル</td><td>GTL LAYOUT DATAPANEL</td><td>GTL</td><td>5</td></tr>
<tr><td>73</td><td>レーダーチャート</td><td>GTL POLYGON+TEXT</td><td>GTL</td><td>5</td></tr>
<tr><td>74</td><td>スパイダーチャート</td><td>GTL POLYGON(複数系列)</td><td>GTL</td><td>5</td></tr>
<tr><td>75</td><td>極座標グラフ</td><td>GTL + 角度変換</td><td>GTL</td><td>5</td></tr>
<tr><td>76</td><td>ゲージ/スピードメーター</td><td>GTL ARC+POLYGON</td><td>GTL</td><td>5</td></tr>
<tr><td>77</td><td>サンキーダイアグラム</td><td>GTL POLYGON+BAND</td><td>GTL</td><td>5</td></tr>
<tr><td>78</td><td>アルビアルダイアグラム</td><td>GTL BAND(多段)</td><td>GTL</td><td>5</td></tr>
<tr><td>79</td><td>ネットワークグラフ</td><td>GTL VECTOR+SCATTER+TEXT</td><td>GTL</td><td>5</td></tr>
<tr><td>80</td><td>デンドログラム(GTL)</td><td>CLUSTER+TREE / GTL</td><td>GTL</td><td>5</td></tr>
<tr><td>81</td><td>コロプレスマップ</td><td>GMAP CHORO</td><td>地図</td><td>5</td></tr>
<tr><td>82</td><td>バブルマップ</td><td>GMAP+ANNOTATE / GTL</td><td>地図</td><td>5</td></tr>
<tr><td>83</td><td>ドットマップ</td><td>SCATTER+マップオーバーレイ</td><td>地図</td><td>5</td></tr>
<tr><td>84</td><td>カートグラム</td><td>GMAP+座標変換</td><td>地図</td><td>5</td></tr>
<tr><td>85</td><td>スイマープロット</td><td>SGPLOT HIGHLOW+SCATTER</td><td>臨床安全</td><td>6</td></tr>
<tr><td>86</td><td>バタフライチャート</td><td>SGPLOT HBAR(正負値)</td><td>臨床安全</td><td>6</td></tr>
<tr><td>87</td><td>トルネードチャート</td><td>SGPLOT HIGHLOW+SCATTER</td><td>臨床安全</td><td>6</td></tr>
<tr><td>88</td><td>有害事象バブルプロット</td><td>SGPLOT BUBBLE</td><td>臨床安全</td><td>6</td></tr>
<tr><td>89</td><td>スパゲッティプロット</td><td>SGPLOT SERIES GROUP=</td><td>臨床安全</td><td>6</td></tr>
<tr><td>90</td><td>スパイダープロット(腫瘍)</td><td>SGPLOT SERIES+REFLINE</td><td>臨床有効</td><td>6</td></tr>
<tr><td>91</td><td>ウォーターフォールプロット</td><td>SGPLOT VBAR(BOR)</td><td>臨床有効</td><td>6</td></tr>
<tr><td>92</td><td>Shift Table可視化</td><td>SGPLOT HEATMAPPARM</td><td>臨床有効</td><td>6</td></tr>
<tr><td>93</td><td>サブグループフォレストプロット</td><td>SGPLOT HIGHLOW+SCATTER+TEXT</td><td>臨床有効</td><td>6</td></tr>
<tr><td>94</td><td>累積イベントプロット</td><td>SGPLOT STEP</td><td>臨床有効</td><td>6</td></tr>
<tr><td>95</td><td>カスタムODSスタイル</td><td>PROC TEMPLATE DEFINE STYLE</td><td>スタイル</td><td>6</td></tr>
<tr><td>96</td><td>データ属性マッピング</td><td>DATTRMAP+ATTRID</td><td>スタイル</td><td>6</td></tr>
<tr><td>97</td><td>凡例・軸・フォント完全カスタマイズ</td><td>XAXIS/YAXIS/KEYLEGEND/INSET</td><td>スタイル</td><td>6</td></tr>
<tr><td>98</td><td>ODS LAYOUT GRIDDED</td><td>ODS LAYOUT GRIDDED</td><td>出力</td><td>6</td></tr>
<tr><td>99</td><td>ODS LAYOUT ABSOLUTE</td><td>ODS LAYOUT ABSOLUTE</td><td>出力</td><td>6</td></tr>
<tr><td>100</td><td>アニメーションGIF</td><td>ODS HTML5+SGANIMATE</td><td>出力</td><td>6</td></tr>
</table>
</div>

<div class="info-box tip">
<div class="info-box-title">DPI/WIDTH/HEIGHT 設定ガイド</div>
<ul>
<li><strong>Web表示用:</strong> WIDTH=800px HEIGHT=600px IMAGEFMT=SVG（軽量・拡大劣化なし）</li>
<li><strong>印刷用:</strong> WIDTH=6in HEIGHT=4.5in IMAGEDPI=300 IMAGEFMT=PNG</li>
<li><strong>申請書類:</strong> WIDTH=7in HEIGHT=5in IMAGEDPI=300 ODS PDF</li>
<li><strong>プレゼン用:</strong> WIDTH=10in HEIGHT=7.5in IMAGEDPI=150 IMAGEFMT=EMF</li>
<li><strong>透過背景:</strong> IMAGEFMT=PNG + ODS GRAPHICS / NOBORDER + スタイルで背景色=transparent</li>
</ul>
</div>
            `,
            quiz: [
                {
                    id: "q604_1",
                    type: "choice",
                    question: "ODS LAYOUTでグラフの位置をピクセル/インチ単位で自由に指定できるのはどれですか？",
                    options: ["ODS LAYOUT GRIDDED", "ODS LAYOUT ABSOLUTE", "ODS LAYOUT LATTICE", "ODS LAYOUT OVERLAY"],
                    answer: 1,
                    explanation: "ODS LAYOUT ABSOLUTEでは各ODS REGIONのX, Y座標とWIDTH, HEIGHTをインチ単位で指定して自由配置できます。"
                },
                {
                    id: "q604_2",
                    type: "choice",
                    question: "印刷用の高品質グラフ出力で推奨されるDPI設定は？",
                    options: ["72 DPI", "150 DPI", "300 DPI", "600 DPI"],
                    answer: 2,
                    explanation: "印刷用途では300 DPIが標準的に推奨されます。Web表示なら72-150 DPI、超高品質なら600 DPIも使用します。"
                },
                {
                    id: "q604_3",
                    type: "choice",
                    question: "FDA/PMDA申請書類に適したODS出力先はどれですか？",
                    options: ["ODS HTML5", "ODS RTF", "ODS PDF", "ODS LISTING"],
                    answer: 2,
                    explanation: "FDA/PMDAへの申請書類にはODS PDFが適しています。印刷品質が高く、レイアウトが固定されるため公式文書に最適です。"
                },
                {
                    id: "q604_4",
                    type: "fill",
                    question: "本アカデミーで学んだSASグラフの総数は何種類ですか？（数字のみ）",
                    answer: "100",
                    explanation: "Level 1からLevel 6まで、合計100種類のSASグラフを体系的に学びました。"
                }
            ]
        }
    ]
};
