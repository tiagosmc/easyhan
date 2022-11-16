>D 48

; Script Editor
;IP=10.1.0.99
;SB=5120
;UFILES=charts.html,charts.js
;UFILES=charts.html,charts.js,discovery1.txt,discovery2.txt
; Script Editor

ver=10217
PF="Factor"
AP="Potência"
TE="Energia"
date=""
time=""
clk=""
old=""
wfc=""
wfp=0
cnt=0
wtd=0
hh=0
mm=0
ss=0
m:ipwrm=0 50
m:epwrm=0 50
ipwr=0
epwr=0
strm="cnt0"
fheap=0
;
ws=""
node=""
key=""
ikw=0
ekw=0
fr=0
res=0
;
lp1y=0
lp1m=0
lp1d=0
lp1hh=0
lp1mm=0
lp3i=0
lp6e=0
lps=""
lpf=""
;
p:ikwo=0
p:ekwo=0
tmp=0
chs=""
chf=""
imp=0
exp=0
;
p:pv1w=0
p:pv1k=0
p:pv1ko=0

>B

=>Delay 100
=>Delay 100
=>Delay 100

tper=20
smlj=0

=>SerialLog 0
=>Sensor53 r

>E

wfc=WifiConfig#?
wfp=WifiPower

>T

ipwr=?#Power
epwr=?#APE
ikw=?#TEI
ekw=?#TEE
lp1y=?#LP1_Y
lp1m=?#LP1_M
lp1d=?#LP1_D
lp1hh=?#LP1_HH
lp1mm=?#LP1_MM
lp3i=?#LP3_IMP
lp6e=?#LP6_EXP

>S

hh=sml[1]
mm=sml[2]
ss=sml[3]

time=st(tstamp T 2)
date=st(tstamp T 1)
fheap=heap/1024

if cnt==25
then
=>UfsRun discovery1.txt
=>WifiConfig
=>WifiPower
smlj=1
tper=10
endif

if cnt==40
then
=>UfsRun discovery2.txt
endif

if cnt<99
then
cnt+=1
print cnt=%0cnt%
endif

if chg[ss]>0
and cnt>30
then
print han %2.0hh%:%2.0mm%:%2.0ss%
ipwrm=ipwr
epwrm=epwr
; freeds
; freeds
endif

strd="cnt"+s(hh)

if chg[hh]>0
and cnt>50
then
;
if hh==0
then
=>UfsDelete2 2d.csv
=>UfsRename2 1d.csv,2d.csv
=>UfsRename2 0d.csv,1d.csv
endif
;
if ikwo==0
then
ikwo=ikw
endif
;
if ekwo==0
then
ekwo=ekw
endif
;
imp=ikw-ikwo
exp=ekw-ekwo
chs=s(2.0hh)+"h"+","+s(imp)+","+s(exp)+","+s(pv1k-pv1ko)+"\n"
chf="0d.csv"
fr=fo(chf 2)
res=fz(fr)
if res==0
then
res=fw(date+",Import,Export,Solar\n" fr)
fc(fr)
fr=fo(chf 2)
endif
res=fw(chs fr)
fc(fr)
;
ikwo=ikw
ekwo=ekw
pv1ko=pv1k
svars
;
endif

lpf="LP-"+s(4.0lp1y)+"-"+s(2.0lp1m)+".csv"

if chg[lp1mm]>0
and cnt>50
then
lps=s(4.0lp1y)+"-"+s(2.0lp1m)+"-"+s(2.0lp1d)+"T"+s(2.0lp1hh)+":"+s(2.0lp1mm)+","+s(0lp3i)+","+s(0lp6e)+"\n"
;
fr=fo(lpf 2)
;
res=fz(fr)
if res==0
then
res=fw("Date,Import Inc,Export Inc\n" fr)
fc(fr)
fr=fo(lpf 2)
endif
;
res=fw(lps fr)
fc(fr)
;
endif

; extras
; extras

>W

@<b>NTP </b> %date% %time% <b> Heap </b> %1fheap%
@<b>Vars </b> cnt=%0cnt% tper=%0tper% smlj=%0smlj% ver=%0ver%
@<b>Vars </b> wtd=%0wtd% clk=%0clk% old=%0old%
@<b>Wifi </b> %wfc% <b> Power </b> %0wfp% <b> Topic </b> %topic%
@<br>
<br>
Solar Power{m}%1pv1w% W
Solar Energy{m}%1pv1k% kWh
<br>
<a href="/ufs/%lpf%">%lpf%</a>{m}<a href="/ufs/charts.html">Charts</a>
<br>

$<div id="chart1" style="width:95%%;height:250px;padding:0px;"></div><br><br>
$gc(lt ipwrm epwrm "wr" "Import" "Export" strm)
$var options = {
$chartArea:{left:50,width:'80%%'},
$width:'100%%',legend:'none',
$title:'Potência ( Watts ) ( 10min )',
$};
$gc(e)

; EB3 only !!!

>M 1

+1,3,mN1,1,9600,EB3,1,20,r010400010001,r0104006C0007,r010400730007,r0104007A0006,r010400260003,r010400160006,r0104000B0004,r01440601

; 01

1,01040Cxxxxxxxxxxuu@i0:1,Clock,h,CH,0
1,01040Cxxxxxxxxxxxxuu@i0:1,Clock,m,CM,0
1,01040Cxxxxxxxxxxxxxxuu@i0:1,Clock,s,CS,0

1,=h<br>

; 6C

1,01040EUUuu@i1:10,Voltage L1,V,VL1,1
1,01040Ex4UUuu@i1:10,Voltage L2,V,VL2,1
1,01040Ex8UUuu@i1:10,Voltage L3,V,VL3,1

1,=h<br>

1,01040ExxxxxxxxxxxxxxxxxxxxxxxxUUuu@i1:10,Current Total,A,Current,1

1,01040ExxxxUUuu@i1:10,Current L1,A,CL1,1
1,01040ExxxxxxxxxxxxUUuu@i1:10,Current L2,A,CL2,1
1,01040ExxxxxxxxxxxxxxxxxxxxUUuu@i1:10,Current L3,A,CL3,1

1,=h<br>

; 73

1,01041cx8x8x8UUuuUUuu@i2:1,%AP% Import,W,Power,0

1,01041cUUuuUUuu@i2:1,%AP% L1,W,API1,0
1,01041cx8UUuuUUuu@i2:1,%AP% L2,W,API2,0
1,01041cx8x8UUuuUUuu@i2:1,%AP% L3,W,API3,0

1,01041cx4UUuuUUuu@i2:1,%AP% L1 Export,W,APE1,0
1,01041cx8x4UUuuUUuu@i2:1,%AP% L2 Export,W,APE2,0
1,01041cx8x8x4UUuuUUuu@i2:1,%AP% L3 Export,W,APE3,0

1,=h<br>

; 7A

1,01040eUUuuUUuu@i3:1,%AP% Export,W,APE,0

1,01040ex4UUuu@i3:1000,%PF%,φ,Factor,3
1,01040ex4xxxxUUuu@i3:1000,%PF% L1,φ,PF1,3
1,01040ex4xxxxxxxxUUuu@i3:1000,%PF% L2,φ,PF2,3
1,01040ex4xxxxxxxxxxxxUUuu@i3:1000,%PF% L3,φ,PF3,3
1,01040ex4xxxxxxxxxxxxxxxxUUuu@i3:10,Frequency,Hz,Frequency,1

1,=h<br>

; 26

1,01040CUUuuUUuu@i4:1000,%TE% T1 Vazio,kWh,TET1,2
1,01040Cx4UUuuUUuu@i4:1000,%TE% T2 Ponta,kWh,TET2,2
1,01040Cx4xxxxxxxxUUuuUUuu@i4:1000,%TE% T3 Cheias,kWh,TET3,2

1,=h<br>

; 16

1,010418UUuuUUuu@i5:1000,%TE% Total Import,kWh,TEI,2
1,010418x4UUuuUUuu@i5:1000,%TE% Total Export,kWh,TEE,2

1,=h<br>

; 0B

1,01040euu@i6:1,Tarifa,,Tariff,0

1,=h<br>

; lp

1,01441dUUuu@i7:1,Year,,LP1_Y,0
1,01441dxxxxuu@i7:1,Month,,LP1_M,0
1,01441dxxxxxxuu@i7:1,Day,,LP1_D,0
1,01441dxxxxxxxxxxuu@i7:1,Hour,h,LP1_HH,0
1,01441dxxxxxxxxxxxxuu@i7:1,Minute,m,LP1_MM,0
; dst
; amr
1,01441dx8x4xxUUuuUUuu@i7:1,Import Inc,Wh,LP3_IMP,0
; lp4
; lp5
1,01441dx8x4x4xxxxxxxxxxxxxxxxxxUUuuUUuu@i7:1,Export Inc,Wh,LP6_EXP,0

; eof lp
; eof meter
#
; eof script
