--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4
-- Dumped by pg_dump version 16.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admission (
    "Department" text,
    "Start_Year" bigint,
    "Number_of_Applicants" bigint,
    "Number_of_Enrolled_Applicants" bigint,
    "Number_of_Processed_Applicants" double precision
);


ALTER TABLE public.admission OWNER TO postgres;

--
-- Name: cpi_education; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cpi_education (
    "Year" bigint,
    "Month" text,
    "CPI_Region3" double precision
);


ALTER TABLE public.cpi_education OWNER TO postgres;

--
-- Name: enrollment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.enrollment (
    "Major" text,
    "Department" text,
    "Semester" bigint,
    "Start_Year" bigint,
    "End_Year" bigint,
    "1st_Year" double precision,
    "2nd_Year" double precision,
    "3rd_Year" double precision,
    "4th_Year" double precision,
    "5th_Year" double precision,
    "Grade_1" double precision,
    "Grade_2" double precision,
    "Grade_3" double precision,
    "Grade_4" double precision,
    "Grade_5" double precision,
    "Grade_6" double precision,
    "Grade_7" double precision,
    "Grade_8" double precision,
    "Grade_9" double precision,
    "Grade_10" double precision,
    "Grade_11" double precision,
    "Grade_12" double precision,
    "TOTAL" bigint
);


ALTER TABLE public.enrollment OWNER TO postgres;

--
-- Name: hfce; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hfce (
    "Start_Year" bigint,
    "Quarter" bigint,
    "HFCE_Education" bigint,
    "HFCE" bigint
);


ALTER TABLE public.hfce OWNER TO postgres;

--
-- Name: inflation_rate; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inflation_rate (
    "Start_Year" bigint,
    "Inflation_Rate" double precision,
    "Inflation_Rate_lag_1" double precision,
    "Inflation_Rate_lag_2" double precision,
    "Inflation_Rate_lag_3" double precision,
    "Inflation_Rate_lag_4" double precision
);


ALTER TABLE public.inflation_rate OWNER TO postgres;

--
-- Data for Name: admission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admission ("Department", "Start_Year", "Number_of_Applicants", "Number_of_Enrolled_Applicants", "Number_of_Processed_Applicants") FROM stdin;
SAS	2018	354	225	229
SBA	2018	1707	1013	1044
SEA	2018	2240	1355	1384
SED	2018	292	139	141
SHTM	2018	562	248	248
SNAMS	2018	370	100	111
CCJEF	2018	162	72	72
CICT	2018	341	222	225
SECOND COURSE	2018	8	6	7
METHODS	2018	1	1	1
CROSS ENROLEE	2018	10	10	10
RETURNING	2018	54	51	52
MASTERATE	2018	184	157	162
DOCTORATE	2018	25	24	24
TOTAL	2018	6310	3623	3710
SAS	2019	450	231	239
SBA	2019	1536	948	956
SEA	2019	2420	1465	1489
SED	2019	200	106	111
SHTM	2019	584	326	337
SNAMS	2019	478	163	170
CCJEF	2019	220	114	117
CICT	2019	377	298	307
SECOND COURSE	2019	12	10	10
METHODS	2019	4	3	3
CROSS ENROLEE	2019	7	6	7
NON CREDIT	2019	1	1	1
RETURNING	2019	1	0	1
MASTERATE	2019	171	142	143
DOCTORATE	2019	30	30	30
TOTAL	2019	6491	3843	3921
SAS	2020	404	198	198
SBA	2020	1333	776	780
SEA	2020	2037	1081	1088
SED	2020	170	79	79
SHTM	2020	468	232	232
SNAMS	2020	541	166	167
SOC	2020	304	214	215
CCJEF	2020	168	86	88
SECOND COURSE	2020	12	10	12
METHODS	2020	1	1	1
MASTERATE	2020	91	88	91
DOCTORATE	2020	36	36	36
TOTAL	2020	5565	2967	2987
SAS	2021	239	167	\N
SBA	2021	962	699	\N
SEA	2021	1575	1061	\N
SED	2021	88	61	\N
SHTM	2021	270	213	\N
SNAMS	2021	450	225	\N
SOC	2021	367	295	\N
CCJEF	2021	92	75	\N
SECOND COURSE	2021	15	8	\N
METHODS	2021	3	3	\N
TRANSFEREE	2021	112	94	\N
MASTERATE	2021	84	64	\N
DOCTORATE	2021	20	16	\N
TOTAL	2021	4277	2981	\N
SAS	2022	229	167	\N
SBA	2022	871	681	\N
SEA	2022	1344	1040	\N
SED	2022	80	62	\N
SHTM	2022	296	234	\N
SNAMS	2022	557	299	\N
SOC	2022	375	313	\N
CCJEF	2022	129	105	\N
SECOND COURSE	2022	15	7	\N
METHODS	2022	3	3	\N
TRANSFEREE	2022	186	147	\N
CROSS ENROLEE	2022	3	3	\N
NON CREDIT	2022	1	1	\N
MASTERATE	2022	133	122	\N
DOCTORATE	2022	24	21	\N
TOTAL	2022	4246	3205	\N
SAS	2023	316	164	\N
SBA	2023	926	594	\N
SEA	2023	1526	852	\N
SED	2023	69	33	\N
SHTM	2023	354	249	\N
SNAMS	2023	750	168	\N
SOC	2023	554	416	\N
CCJEF	2023	151	84	\N
SECOND COURSE	2023	13	8	\N
METHODS	2023	2	0	\N
TRANSFEREE	2023	264	214	\N
CROSS ENROLEE	2023	2	2	\N
NON CREDIT	2023	1	1	\N
MASTERATE	2023	107	74	\N
DOCTORATE	2023	28	23	\N
TOTAL	2023	5063	2882	\N
\.


--
-- Data for Name: cpi_education; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cpi_education ("Year", "Month", "CPI_Region3") FROM stdin;
2012	Jan	82.2
2012	Feb	82.2
2012	Mar	82.2
2012	Apr	82.2
2012	May	82.2
2012	Jun	86.2
2012	Jul	86.2
2012	Aug	86.2
2012	Sep	86.2
2012	Oct	86.2
2012	Nov	86.2
2012	Dec	86.2
2012	Ave	84.6
2013	Jan	86.2
2013	Feb	86.2
2013	Mar	86.2
2013	Apr	86.2
2013	May	86.2
2013	Jun	90.4
2013	Jul	91.2
2013	Aug	91.2
2013	Sep	91.2
2013	Oct	91.2
2013	Nov	91.2
2013	Dec	91.2
2013	Ave	89.1
2014	Jan	91.2
2014	Feb	91.2
2014	Mar	91.2
2014	Apr	91.2
2014	May	91.2
2014	Jun	95.6
2014	Jul	95.6
2014	Aug	95.6
2014	Sep	95.6
2014	Oct	95.6
2014	Nov	95.6
2014	Dec	95.6
2014	Ave	93.8
2015	Jan	95.6
2015	Feb	95.6
2015	Mar	95.6
2015	Apr	95.6
2015	May	95.6
2015	Jun	96
2015	Jul	96.8
2015	Aug	96.8
2015	Sep	96.8
2015	Oct	96.8
2015	Nov	96.8
2015	Dec	96.8
2015	Ave	96.2
2016	Jan	96.8
2016	Feb	96.8
2016	Mar	96.8
2016	Apr	96.8
2016	May	96.8
2016	Jun	98.1
2016	Jul	98.2
2016	Aug	98.2
2016	Sep	98.2
2016	Oct	98.2
2016	Nov	103
2016	Dec	103
2016	Ave	98.4
2017	Jan	103
2017	Feb	103
2017	Mar	103
2017	Apr	103
2017	May	103
2017	Jun	105.1
2017	Jul	106.1
2017	Aug	106.1
2017	Sep	106.1
2017	Oct	106.1
2017	Nov	106.1
2017	Dec	106.1
2017	Ave	104.7
2018	Jan	98.5
2018	Feb	98.5
2018	Mar	98.5
2018	Apr	98.5
2018	May	98.5
2018	Jun	101.1
2018	Jul	101.1
2018	Aug	101.1
2018	Sep	101.1
2018	Oct	101.1
2018	Nov	101.1
2018	Dec	101.1
2019	Jan	101.1
2019	Feb	101.1
2019	Mar	101.1
2019	Apr	101.1
2019	May	101.1
2019	Jun	102.1
2019	Jul	102.8
2019	Aug	102.8
2019	Sep	102.8
2019	Oct	102.8
2019	Nov	102.8
2019	Dec	102.8
2020	Jan	103.6
2020	Feb	103.6
2020	Mar	103.6
2020	Apr	103.6
2020	May	103.6
2020	Jun	103.6
2020	Jul	103.6
2020	Aug	103.6
2020	Sep	103.2
2020	Oct	103.3
2020	Nov	103.3
2020	Dec	103.3
2021	Jan	103.3
2021	Feb	103.3
2021	Mar	103.3
2021	Apr	103.3
2021	May	103.3
2021	Jun	103.3
2021	Jul	103.3
2021	Aug	103.2
2021	Sep	103.4
2021	Oct	103.4
2021	Nov	103.4
2021	Dec	103.4
2022	Jan	103.4
2022	Feb	103.4
2022	Mar	103.4
2022	Apr	103.4
2022	May	103.4
2022	Jun	103.4
2022	Jul	103.4
2022	Aug	102.8
2022	Sep	103
2022	Oct	103
2022	Nov	103
2022	Dec	103
2023	Jan	103
2023	Feb	103
2023	Mar	103
2023	Apr	103
2023	May	103
2023	Jun	103
2023	Jul	103
2023	Aug	104.7
2023	Sep	107.3
2023	Oct	107.3
2023	Nov	107.3
2023	Dec	107.3
2024	Jan	107.3
2024	Feb	106.8
2024	Mar	106.8
2024	Apr	106.8
2024	May	106.8
2024	Jun	106.8
2024	Jul	107.4
\.


--
-- Data for Name: enrollment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.enrollment ("Major", "Department", "Semester", "Start_Year", "End_Year", "1st_Year", "2nd_Year", "3rd_Year", "4th_Year", "5th_Year", "Grade_1", "Grade_2", "Grade_3", "Grade_4", "Grade_5", "Grade_6", "Grade_7", "Grade_8", "Grade_9", "Grade_10", "Grade_11", "Grade_12", "TOTAL") FROM stdin;
BS Criminology	CCJEF	1	2016	2017	\N	1	12	85	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	98
Criminology	CCJEF	1	2016	2017	5	126	91	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	222
TOTAL	CCJEF	1	2016	2017	5	127	103	85	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	320
BSBATourism	CHTM	1	2016	2017	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
TOTAL	CHTM	1	2016	2017	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
BSCSSysDev	CICT	1	2016	2017	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
BSITWebdev	CICT	1	2016	2017	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
TOTAL	CICT	1	2016	2017	1	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2
GS	GS	1	2016	2017	\N	\N	\N	\N	\N	79	80	92	94	131	103	\N	\N	\N	\N	\N	\N	579
TOTAL	GS	1	2016	2017	\N	\N	\N	\N	\N	79	80	92	94	131	103	\N	\N	\N	\N	\N	\N	579
JHS	JHS	1	2016	2017	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	916	879	819	834	\N	\N	3448
TOTAL	JHS	1	2016	2017	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	916	879	819	834	\N	\N	3448
MAPEH-BSED	MA	1	2016	2017	\N	\N	3	21	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	24
TOTAL	MA	1	2016	2017	\N	\N	3	21	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	24
ABComm	SAS	1	2016	2017	3	123	93	109	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	328
AdvPublicRel	SAS	1	2016	2017	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
BSPsychology	SAS	1	2016	2017	1	117	80	107	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	305
LanguageLit	SAS	1	2016	2017	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
TOTAL	SAS	1	2016	2017	4	240	173	218	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	635
Accountancy	SBA	1	2016	2017	9	751	746	651	97	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2254
Accounting	SBA	1	2016	2017	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2
Accounting Tech	SBA	1	2016	2017	8	31	45	69	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	153
BSBA HRDM	SBA	1	2016	2017	6	20	26	19	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	71
BSBA-BM-Marketi	SBA	1	2016	2017	\N	\N	1	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2
BSBA-MktgMgmt	SBA	1	2016	2017	8	111	94	103	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	316
BSBALegal	SBA	1	2016	2017	1	21	23	22	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	67
BusMgt	SBA	1	2016	2017	20	341	315	284	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	960
TOTAL	SBA	1	2016	2017	52	1275	1250	1151	97	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	3825
Architecture	SEA	1	2016	2017	5	275	236	197	202	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	915
BSAeronautical	SEA	1	2016	2017	4	210	171	91	47	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	432
CE	SEA	1	2016	2017	11	348	306	267	148	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1080
Comp. Eng'g.	SEA	1	2016	2017	8	62	57	26	32	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	185
ECE	SEA	1	2016	2017	\N	7	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	8
EE	SEA	1	2016	2017	\N	76	72	46	34	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	228
ELECENG	SEA	1	2016	2017	1	122	110	77	92	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	402
IE	SEA	1	2016	2017	3	60	56	45	40	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	204
ME	SEA	1	2016	2017	4	135	184	114	84	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	521
TOTAL	SEA	1	2016	2017	36	1295	1193	863	679	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	4066
BEEd	SED	1	2016	2017	1	48	42	41	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	132
BEED-MajSPED 	SED	1	2016	2017	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
BEED-SpecialEdu	SED	1	2016	2017	1	21	20	22	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	64
Biological	SED	1	2016	2017	2	23	32	19	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	76
BPE-SPE	SED	1	2016	2017	\N	22	32	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	54
BSED-ValEd	SED	1	2016	2017	1	14	12	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	35
English-BSED	SED	1	2016	2017	3	39	35	36	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	113
Fil-BSED	SED	1	2016	2017	\N	20	27	20	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	67
Math	SED	1	2016	2017	3	13	18	14	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	48
SocialStud-BSED	SED	1	2016	2017	2	18	16	14	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	50
TOTAL	SED	1	2016	2017	13	219	234	174	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	640
SHS-ABM	SHS	1	2016	2017	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	452	\N	452
SHS-HUMSS	SHS	1	2016	2017	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	217	\N	217
SHS-STEM	SHS	1	2016	2017	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	832	\N	832
SHS-TVL-HE	SHS	1	2016	2017	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	176	\N	176
TOTAL	SHS	1	2016	2017	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1677	\N	1677
BS EventMgmt	SHTM	1	2016	2017	1	11	5	15	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	32
BSCulinary	SHTM	1	2016	2017	16	91	88	66	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	261
BSHRM	SHTM	1	2016	2017	34	206	130	180	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	550
BSTourism	SHTM	1	2016	2017	34	214	187	168	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	603
TOTAL	SHTM	1	2016	2017	85	522	410	429	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1446
BS MedTech	SNAMS	1	2016	2017	\N	78	87	35	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	200
BSNursing	SNAMS	1	2016	2017	1	48	18	22	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	89
BSRadTech	SNAMS	1	2016	2017	5	30	29	23	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	87
TOTAL	SNAMS	1	2016	2017	6	156	134	80	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	376
BSCompsci	SOC	1	2016	2017	12	71	51	37	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	171
BSITAreaAnimati	SOC	1	2016	2017	18	88	65	75	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	246
BSITAreaNetAdmi	SOC	1	2016	2017	26	177	124	94	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	421
BSITAreaWebDev	SOC	1	2016	2017	20	120	86	75	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	301
TOTAL	SOC	1	2016	2017	76	456	326	281	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1139
GRAND TOTAL	HAU	1	2016	2017	278	4291	3826	3303	776	79	80	92	94	131	103	916	879	819	834	1677	0	18178
BS Criminology	CCJEF	2	2016	2017	\N	\N	10	87	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	97
Criminology	CCJEF	2	2016	2017	\N	112	95	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	208
TOTAL	CCJEF	2	2016	2017	\N	112	105	88	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	305
BSBATourism	CHTM	2	2016	2017	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
TOTAL	CHTM	2	2016	2017	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
BSITAnimation	CICT	2	2016	2017	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
BSITWebdev	CICT	2	2016	2017	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
TOTAL	CICT	2	2016	2017	1	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2
MAPEH-BSED	MA	2	2016	2017	1	\N	\N	23	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	24
TOTAL	MA	2	2016	2017	1	\N	\N	23	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	24
ABComm	SAS	2	2016	2017	2	92	105	108	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	307
BSPsychology	SAS	2	2016	2017	\N	108	82	110	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	300
CommArts	SAS	2	2016	2017	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
LanguageLit	SAS	2	2016	2017	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
TOTAL	SAS	2	2016	2017	2	200	187	220	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	609
Accountancy	SBA	2	2016	2017	1	745	733	40	96	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1615
Accounting	SBA	2	2016	2017	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2
Accounting Tech	SBA	2	2016	2017	\N	31	47	680	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	758
BSBA HRDM	SBA	2	2016	2017	3	19	24	19	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	65
BSBA-BM-Marketi	SBA	2	2016	2017	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
BSBA-MktgMgmt	SBA	2	2016	2017	1	97	96	87	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	281
BSBALegal	SBA	2	2016	2017	\N	17	23	20	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	60
BusMgt	SBA	2	2016	2017	6	334	316	254	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	910
TOTAL	SBA	2	2016	2017	11	1243	1240	1102	96	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	3692
Architecture	SEA	2	2016	2017	3	256	220	208	199	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	886
BSAeronautical	SEA	2	2016	2017	5	203	156	101	57	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	522
CE	SEA	2	2016	2017	11	326	298	239	176	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1050
Comp. Eng'g.	SEA	2	2016	2017	1	62	49	31	31	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	174
ECE	SEA	2	2016	2017	\N	8	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	9
EE	SEA	2	2016	2017	1	72	72	42	35	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	222
ELECENG	SEA	2	2016	2017	\N	113	96	82	96	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	387
IE	SEA	2	2016	2017	1	57	50	41	42	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	191
ME	SEA	2	2016	2017	2	136	185	115	86	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	524
TOTAL	SEA	2	2016	2017	24	1233	1127	859	722	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	3965
BEEd	SED	2	2016	2017	2	41	47	38	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	128
BEED-MajSPED 	SED	2	2016	2017	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
BEED-SpecialEdu	SED	2	2016	2017	\N	23	20	20	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	63
Biological	SED	2	2016	2017	2	21	32	17	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	72
BPE-SPE	SED	2	2016	2017	\N	17	38	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	55
BSED-ValEd	SED	2	2016	2017	\N	10	12	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	31
English-BSED	SED	2	2016	2017	2	36	35	37	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	110
Fil-BSED	SED	2	2016	2017	1	17	25	21	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	64
Math	SED	2	2016	2017	1	10	20	14	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	45
SocialStud-BSED	SED	2	2016	2017	4	17	14	12	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	47
TOTAL	SED	2	2016	2017	12	193	243	168	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	616
SHS-ABM	SHS	2	2016	2017	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	447	\N	447
SHS-HUMSS	SHS	2	2016	2017	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	217	\N	217
SHS-STEM	SHS	2	2016	2017	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	808	\N	808
SHS-TVL-HE	SHS	2	2016	2017	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	174	\N	174
TOTAL	SHS	2	2016	2017	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1646	\N	1646
BS EventMgmt	SHTM	2	2016	2017	\N	8	6	15	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	29
BSBA-HRM	SHTM	2	2016	2017	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
BSCulinary	SHTM	2	2016	2017	20	80	79	68	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	247
BSHRM	SHTM	2	2016	2017	19	183	133	153	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	488
BSTM-Travel	SHTM	2	2016	2017	1	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2
BSTourism	SHTM	2	2016	2017	25	201	181	151	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	558
TOTAL	SHTM	2	2016	2017	65	473	399	388	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1325
BS MedTech	SNAMS	2	2016	2017	\N	69	77	31	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	177
BSNursing	SNAMS	2	2016	2017	\N	43	17	22	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	82
BSRadTech	SNAMS	2	2016	2017	\N	30	27	23	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	80
TOTAL	SNAMS	2	2016	2017	\N	142	121	76	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	339
BSCompsci	SOC	2	2016	2017	3	62	53	29	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	147
BSITAreaAnimati	SOC	2	2016	2017	5	88	66	70	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	229
BSITAreaNetAdmi	SOC	2	2016	2017	7	164	141	87	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	399
BSITAreaWebDev	SOC	2	2016	2017	10	117	82	78	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	287
TOTAL	SOC	2	2016	2017	25	431	342	264	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1062
GRAND TOTAL	HAU	2	2016	2017	142	4028	3764	3188	818	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1646	\N	13586
BS Criminology	CCJEF	1	2017	2018	\N	\N	3	20	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	23
Criminology	CCJEF	1	2017	2018	\N	6	109	79	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	194
TOTAL	CCJEF	1	2017	2018	\N	6	112	99	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	217
BSITAnimation	CICT	1	2017	2018	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
BSITNetAdmin	CICT	1	2017	2018	\N	\N	1	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2
BSITWebdev	CICT	1	2017	2018	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
TOTAL	CICT	1	2017	2018	1	1	1	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	4
GS	GS	1	2017	2018	\N	\N	\N	\N	\N	67	78	74	90	92	131	\N	\N	\N	\N	\N	\N	532
TOTAL	GS	1	2017	2018	\N	\N	\N	\N	\N	67	78	74	90	92	131	\N	\N	\N	\N	\N	\N	532
JHS	JHS	1	2017	2018	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	933	906	886	846	\N	\N	3571
TOTAL	JHS	1	2017	2018	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	933	906	886	846	\N	\N	3571
MAPEH-BSED	MA	1	2017	2018	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	4
MSEngMgmt	MA	1	2017	2018	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
TOTAL	MA	1	2017	2018	1	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	5
ABComm	SAS	1	2017	2018	2	3	107	91	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	203
BSPsychology	SAS	1	2017	2018	\N	\N	121	72	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	193
TOTAL	SAS	1	2017	2018	2	3	228	163	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0
Accountancy	SBA	1	2017	2018	\N	20	735	733	128	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1616
Accounting	SBA	1	2017	2018	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
Accounting Tech	SBA	1	2017	2018	2	5	35	76	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	118
BSBA HRDM	SBA	1	2017	2018	\N	5	22	30	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	57
BSBA-BM-Marketi	SBA	1	2017	2018	\N	\N	1	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2
BSBA-MktgMgmt	SBA	1	2017	2018	1	17	93	102	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	213
BSBALegal	SBA	1	2017	2018	\N	\N	21	26	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	47
BusMgt	SBA	1	2017	2018	4	33	321	313	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	671
BussMgmt-HRM	SBA	1	2017	2018	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
TOTAL	SBA	1	2017	2018	7	80	1229	1282	128	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2726
Architecture	SEA	1	2017	2018	3	12	264	217	227	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	723
BSAeronautical	SEA	1	2017	2018	\N	15	213	133	86	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	447
CE	SEA	1	2017	2018	1	19	339	303	201	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	863
Comp. Eng'g.	SEA	1	2017	2018	1	8	54	42	33	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	138
ECE	SEA	1	2017	2018	\N	\N	10	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	11
ECETech.	SEA	1	2017	2018	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
EE	SEA	1	2017	2018	1	5	91	53	50	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	200
ELECENG	SEA	1	2017	2018	\N	3	107	86	88	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	284
IE	SEA	1	2017	2018	1	2	67	55	55	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	180
ME	SEA	1	2017	2018	\N	14	195	167	106	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	482
TOTAL	SEA	1	2017	2018	7	78	1341	1057	846	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	3329
BEEd	SED	1	2017	2018	\N	1	46	45	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	92
BEED-MajSPED 	SED	1	2017	2018	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
BEED-SpecialEdu	SED	1	2017	2018	\N	\N	22	20	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	42
Biological	SED	1	2017	2018	\N	\N	26	27	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	53
BPE-SPE	SED	1	2017	2018	\N	\N	24	29	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	53
BPEd	SED	1	2017	2018	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
BSED-ValEd	SED	1	2017	2018	\N	\N	13	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	23
BSMath	SED	1	2017	2018	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
English-BSED	SED	1	2017	2018	\N	\N	35	34	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	69
Fil-BSED	SED	1	2017	2018	\N	\N	17	22	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	39
Math	SED	1	2017	2018	1	\N	15	15	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	31
SocialStud-BSED	SED	1	2017	2018	\N	1	18	15	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	34
TOTAL	SED	1	2017	2018	2	2	218	217	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	439
SHS-ABM	SHS	1	2017	2018	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	348	441	789
SHS-GenAcad	SHS	1	2017	2018	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	349	\N	349
SHS-HUMSS	SHS	1	2017	2018	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	157	213	370
SHS-STEM	SHS	1	2017	2018	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	686	789	1475
SHS-TVL-HE	SHS	1	2017	2018	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	183	180	363
TOTAL	SHS	1	2017	2018	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1723	1623	3346
BS EventMgmt	SHTM	1	2017	2018	1	1	9	11	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	22
BSBA-HRM	SHTM	1	2017	2018	\N	2	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	3
BSCulinary	SHTM	1	2017	2018	8	16	78	81	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	183
BSHRM	SHTM	1	2017	2018	20	62	161	163	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	406
BSTourism	SHTM	1	2017	2018	5	38	194	178	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	415
TOTAL	SHTM	1	2017	2018	34	119	442	434	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1029
BS MedTech	SNAMS	1	2017	2018	\N	\N	75	55	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	130
BSNursing	SNAMS	1	2017	2018	\N	\N	36	18	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	54
BSRadTech	SNAMS	1	2017	2018	\N	1	24	24	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	49
TOTAL	SNAMS	1	2017	2018	\N	1	135	97	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	233
BSCompsci	SOC	1	2017	2018	1	13	54	50	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	118
BSITAreaAnimati	SOC	1	2017	2018	2	16	86	48	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	152
BSITAreaNetAdmi	SOC	1	2017	2018	3	38	168	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	309
BSITAreaWebDev	SOC	1	2017	2018	1	22	113	74	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	210
TOTAL	SOC	1	2017	2018	7	89	421	272	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	789
GRAND TOTAL	HAU	1	2017	2018	61	379	4127	3626	974	67	78	74	90	92	131	933	906	886	846	1723	1623	16616
BS Criminology	CCJEF	2	2017	2018	\N	\N	1	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	8
Criminology	CCJEF	2	2017	2018	\N	1	108	84	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	193
TOTAL	CCJEF	2	2017	2018	\N	1	109	91	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	201
BSITNetAdmin	CICT	2	2017	2018	\N	1	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2
BSITWebdev	CICT	2	2017	2018	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
TOTAL	CICT	2	2017	2018	\N	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	3
MAPEH-BSED	MA	2	2017	2018	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
MBM	MA	2	2017	2018	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
TOTAL	MA	2	2017	2018	1	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2
ABComm	SAS	2	2017	2018	2	\N	98	89	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	189
BA Comm	SAS	2	2017	2018	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
BSPsychology	SAS	2	2017	2018	1	\N	116	74	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	191
LanguageLit	SAS	2	2017	2018	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
TOTAL	SAS	2	2017	2018	3	\N	215	164	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	382
Accountancy	SBA	2	2017	2018	\N	1	743	168	129	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1041
Accounting Tech	SBA	2	2017	2018	2	\N	40	633	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	675
BSBA HRDM	SBA	2	2017	2018	\N	3	21	24	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	48
BSBA-BM-Marketi	SBA	2	2017	2018	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
BSBA-MktgMgmt	SBA	2	2017	2018	\N	4	98	96	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	198
BSBALegal	SBA	2	2017	2018	1	\N	19	24	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	44
BusMgt	SBA	2	2017	2018	1	5	316	302	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	624
BussMgmt-HRM	SBA	2	2017	2018	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
TOTAL	SBA	2	2017	2018	4	13	1238	1248	129	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2632
Architecture	SEA	2	2017	2018	2	12	238	226	231	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	709
BSAeronautical	SEA	2	2017	2018	3	6	204	132	94	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	439
CE	SEA	2	2017	2018	7	12	322	290	210	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	841
Comp. Eng'g.	SEA	2	2017	2018	1	5	50	42	28	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	126
ECE	SEA	2	2017	2018	\N	\N	9	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	10
ECETech.	SEA	2	2017	2018	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
EE	SEA	2	2017	2018	1	5	88	49	45	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	188
ELECENG	SEA	2	2017	2018	2	2	92	82	85	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	263
IE	SEA	2	2017	2018	1	1	71	54	45	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	172
ME	SEA	2	2017	2018	5	10	199	162	110	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	486
TOTAL	SEA	2	2017	2018	22	53	1274	1038	848	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	3235
BEEd	SED	2	2017	2018	\N	\N	43	40	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	83
BEED-MajSPED 	SED	2	2017	2018	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
BEED-SpecialEdu	SED	2	2017	2018	\N	\N	22	20	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	42
Biological	SED	2	2017	2018	\N	\N	23	30	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	53
BPE-SPE	SED	2	2017	2018	\N	\N	22	31	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	53
BSED-ValEd	SED	2	2017	2018	\N	\N	11	12	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	23
English-BSED	SED	2	2017	2018	\N	1	32	33	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	66
Fil-BSED	SED	2	2017	2018	\N	\N	13	25	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	38
Math	SED	2	2017	2018	1	\N	11	19	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	31
SocialStud-BSED	SED	2	2017	2018	\N	\N	19	15	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	34
TOTAL	SED	2	2017	2018	1	1	197	225	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	424
SHS-ABM	SHS	2	2017	2018	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	345	439	784
SHS-GenAcad	SHS	2	2017	2018	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	333	\N	333
SHS-HUMSS	SHS	2	2017	2018	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	153	214	367
SHS-STEM	SHS	2	2017	2018	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	681	785	1466
SHS-TVL-HE	SHS	2	2017	2018	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	175	178	353
TOTAL	SHS	2	2017	2018	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1687	1616	3303
BS EventMgmt	SHTM	2	2017	2018	2	2	6	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	17
BSBA-HRM	SHTM	2	2017	2018	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2
BSCulinary	SHTM	2	2017	2018	6	14	75	79	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	174
BSHRM	SHTM	2	2017	2018	11	59	163	129	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	362
BSTourism	SHTM	2	2017	2018	1	35	174	156	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	366
TOTAL	SHTM	2	2017	2018	20	112	418	371	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	921
BS MedTech	SNAMS	2	2017	2018	\N	\N	61	49	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	110
BSNursing	SNAMS	2	2017	2018	\N	\N	37	18	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	55
BSRadTech	SNAMS	2	2017	2018	\N	\N	25	20	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	45
TOTAL	SNAMS	2	2017	2018	\N	\N	123	87	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	210
BSCompsci	SOC	2	2017	2018	\N	9	50	46	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	105
BSEMC-DA	SOC	2	2017	2018	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
BSITAreaAnimati	SOC	2	2017	2018	2	7	75	60	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	144
BSITAreaNetAdmi	SOC	2	2017	2018	1	23	166	101	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	291
BSITAreaWebDev	SOC	2	2017	2018	\N	9	107	79	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	195
TOTAL	SOC	2	2017	2018	3	49	398	286	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	736
GRAND TOTAL	HAU	2	2017	2018	54	231	3973	3511	977	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1687	1616	12049
BS Criminology	CCJEF	1	2018	2019	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	3
Criminology	CCJEF	1	2018	2019	75	\N	2	109	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	186
TOTAL	CCJEF	1	2018	2019	75	\N	2	112	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	189
GS	GS	1	2018	2019	\N	\N	\N	\N	\N	73	80	80	73	86	90	\N	\N	\N	\N	\N	\N	482
TOTAL	GS	1	2018	2019	\N	\N	\N	\N	\N	73	80	80	73	86	90	\N	\N	\N	\N	\N	\N	482
JHS	JHS	1	2018	2019	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	928	912	908	915	1	\N	3664
TOTAL	JHS	1	2018	2019	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	928	912	908	915	1	\N	3664
MAPEH-BSED	MA	1	2018	2019	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
TOTAL	MA	1	2018	2019	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
ABComm	SAS	1	2018	2019	1	\N	1	108	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	110
BA Comm	SAS	1	2018	2019	117	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	117
BSPsychology	SAS	1	2018	2019	127	\N	1	122	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	250
TOTAL	SAS	1	2018	2019	245	\N	2	230	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	477
Accountancy	SBA	1	2018	2019	761	\N	17	736	124	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1638
Accounting	SBA	1	2018	2019	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
Accounting Tech	SBA	1	2018	2019	\N	\N	5	73	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	79
BSAcctgInfoSys	SBA	1	2018	2019	1	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2
BSBA HRDM	SBA	1	2018	2019	1	2	2	25	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	30
BSBA-FinMgmt	SBA	1	2018	2019	11	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	11
BSBA-HRMgmt	SBA	1	2018	2019	16	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	16
BSBA-MktgMgmt	SBA	1	2018	2019	89	1	10	112	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	212
BSBALegal	SBA	1	2018	2019	3	\N	\N	21	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	24
BusMgt	SBA	1	2018	2019	171	1	37	335	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	545
BussMgmt-HRM	SBA	1	2018	2019	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
TOTAL	SBA	1	2018	2019	1053	4	71	1305	126	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2559
Architecture	SEA	1	2018	2019	255	1	26	236	252	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	770
BSAeronautical	SEA	1	2018	2019	451	1	28	190	132	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	802
CE	SEA	1	2018	2019	386	1	47	304	278	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1016
Comp. Eng'g.	SEA	1	2018	2019	59	\N	16	45	38	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	158
ECE	SEA	1	2018	2019	\N	\N	\N	7	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	8
ECETech.	SEA	1	2018	2019	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
EE	SEA	1	2018	2019	61	\N	11	84	55	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	211
ELECENG	SEA	1	2018	2019	60	1	18	82	81	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	242
IE	SEA	1	2018	2019	44	\N	8	65	67	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	184
ME	SEA	1	2018	2019	137	1	24	202	155	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	519
TOTAL	SEA	1	2018	2019	1453	5	178	1216	1059	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	3911
BEEd	SED	1	2018	2019	17	\N	3	49	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	69
BEED-MajSPED 	SED	1	2018	2019	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
BEED-SpecialEdu	SED	1	2018	2019	8	\N	1	22	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	31
Biological	SED	1	2018	2019	6	\N	\N	29	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	35
BPE-SPE	SED	1	2018	2019	\N	\N	\N	25	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	25
BPEd	SED	1	2018	2019	18	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	18
BSED-ValEd	SED	1	2018	2019	13	\N	\N	14	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	27
BSNEd	SED	1	2018	2019	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	3
English-BSED	SED	1	2018	2019	49	\N	\N	39	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	88
Fil-BSED	SED	1	2018	2019	10	\N	\N	16	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	26
Math	SED	1	2018	2019	10	\N	\N	18	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	28
SocialStud-BSED	SED	1	2018	2019	14	\N	2	22	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	38
TOTAL	SED	1	2018	2019	148	\N	6	235	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	389
SHS-ABM	SHS	1	2018	2019	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	280	364	644
SHS-GenAcad	SHS	1	2018	2019	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	123	294	417
SHS-HUMSS	SHS	1	2018	2019	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	140	170	310
SHS-STEM	SHS	1	2018	2019	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	707	677	1384
SHS-TVL-HE	SHS	1	2018	2019	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	194	186	380
TOTAL	SHS	1	2018	2019	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1444	1691	3135
BS EventMgmt	SHTM	1	2018	2019	9	2	1	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	22
BSBA-HRM	SHTM	1	2018	2019	\N	1	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2
BSCulinary	SHTM	1	2018	2019	35	16	13	84	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	148
BSHM-Accomm	SHTM	1	2018	2019	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2
BSHM-Culinary	SHTM	1	2018	2019	2	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	3
BSHM-RestFood	SHTM	1	2018	2019	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	3
BSHRM	SHTM	1	2018	2019	83	40	48	178	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	349
BSTM-Tourism	SHTM	1	2018	2019	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2
BSTourism	SHTM	1	2018	2019	130	13	37	177	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	357
TOTAL	SHTM	1	2018	2019	265	73	100	450	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	888
BS MedTech	SNAMS	1	2018	2019	42	\N	3	60	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	105
BSNursing	SNAMS	1	2018	2019	47	\N	\N	37	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	84
BSRadTech	SNAMS	1	2018	2019	16	\N	\N	24	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	40
TOTAL	SNAMS	1	2018	2019	105	\N	3	121	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	229
BSCompsci	SOC	1	2018	2019	59	4	3	54	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	120
BSEMC-DA	SOC	1	2018	2019	63	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	63
BSITAreaAnimati	SOC	1	2018	2019	\N	1	24	71	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	96
BSITAreaNetAdmi	SOC	1	2018	2019	53	16	46	150	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	265
BSITAreaWebDev	SOC	1	2018	2019	69	5	21	105	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	200
BSITMultiTec	SOC	1	2018	2019	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
TOTAL	SOC	1	2018	2019	244	26	94	381	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	745
GRAND TOTAL	HAU	1	2018	2019	3588	108	456	4051	1185	73	80	80	73	86	90	928	912	908	915	1445	1691	16669
BForensicSci	CCJEF	2	2018	2019	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	3
Criminology	CCJEF	2	2018	2019	77	\N	\N	104	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	181
TOTAL	CCJEF	2	2018	2019	80	\N	\N	104	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	184
ABComm	SAS	2	2018	2019	4	\N	\N	88	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	92
BA Comm	SAS	2	2018	2019	110	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	113
BSPsychology	SAS	2	2018	2019	117	\N	\N	118	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	235
TOTAL	SAS	2	2018	2019	231	\N	\N	209	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	440
Accountancy	SBA	2	2018	2019	695	\N	\N	174	124	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	993
Accounting Tech	SBA	2	2018	2019	\N	\N	\N	622	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	622
BSAcctgInfoSys	SBA	2	2018	2019	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
BSBA HRDM	SBA	2	2018	2019	\N	\N	\N	24	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	24
BSBA-FinMgmt	SBA	2	2018	2019	13	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	13
BSBA-HRMgmt	SBA	2	2018	2019	20	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	20
BSBA-MktgMgmt	SBA	2	2018	2019	81	\N	4	94	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	179
BSBALegal	SBA	2	2018	2019	\N	\N	\N	17	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	17
BusMgt	SBA	2	2018	2019	180	\N	13	315	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	508
TOTAL	SBA	2	2018	2019	990	\N	17	1246	124	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2377
Architecture	SEA	2	2018	2019	236	1	6	227	275	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	745
BSAeronautical	SEA	2	2018	2019	411	\N	8	193	143	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	755
CE	SEA	2	2018	2019	379	1	16	304	278	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	978
Comp. Eng'g.	SEA	2	2018	2019	54	\N	6	46	40	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	146
EE	SEA	2	2018	2019	52	\N	6	85	53	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	196
ELECENG	SEA	2	2018	2019	53	\N	5	95	80	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	233
IE	SEA	2	2018	2019	35	\N	\N	71	53	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	159
ME	SEA	2	2018	2019	116	\N	16	205	144	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	481
TOTAL	SEA	2	2018	2019	1336	2	63	1226	1066	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	3693
BEEd	SED	2	2018	2019	14	\N	\N	47	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	61
BEED-MajSPED 	SED	2	2018	2019	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
BEED-SpecialEdu	SED	2	2018	2019	\N	\N	\N	23	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	23
Biological	SED	2	2018	2019	\N	\N	\N	29	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	29
BPE-SPE	SED	2	2018	2019	\N	\N	\N	25	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	25
BPEd	SED	2	2018	2019	14	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	14
BSED-ValEd	SED	2	2018	2019	17	\N	\N	13	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	30
BSNEd	SED	2	2018	2019	12	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	12
English-BSED	SED	2	2018	2019	30	\N	\N	34	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	64
Fil-BSED	SED	2	2018	2019	13	\N	\N	18	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	31
Math	SED	2	2018	2019	13	\N	\N	17	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	30
Science-BSED	SED	2	2018	2019	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	8
SocialStud-BSED	SED	2	2018	2019	16	\N	\N	22	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	38
TOTAL	SED	2	2018	2019	137	\N	\N	229	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	366
SHS-ABM	SHS	2	2018	2019	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	279	366	645
SHS-GenAcad	SHS	2	2018	2019	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	125	291	416
SHS-HUMSS	SHS	2	2018	2019	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	140	168	308
SHS-STEM	SHS	2	2018	2019	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	694	676	1370
SHS-TVL-HE	SHS	2	2018	2019	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	188	183	371
TOTAL	SHS	2	2018	2019	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1426	1684	3110
BS EventMgmt	SHTM	2	2018	2019	9	1	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	17
BSCulinary	SHTM	2	2018	2019	31	7	17	70	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	125
BSHM-Accomm	SHTM	2	2018	2019	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2
BSHM-Culinary	SHTM	2	2018	2019	6	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7
BSHM-RestFood	SHTM	2	2018	2019	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
BSHRM	SHTM	2	2018	2019	70	30	59	137	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	296
BSTM-DestMgmt	SHTM	2	2018	2019	21	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	21
BSTM-Events	SHTM	2	2018	2019	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
BSTM-Travel	SHTM	2	2018	2019	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	4
BSTourism	SHTM	2	2018	2019	102	5	41	142	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	290
TOTAL	SHTM	2	2018	2019	247	43	118	356	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	764
BS MedTech	SNAMS	2	2018	2019	35	\N	1	61	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	97
BSNursing	SNAMS	2	2018	2019	47	\N	\N	34	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	81
BSRadTech	SNAMS	2	2018	2019	14	\N	\N	25	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	39
TOTAL	SNAMS	2	2018	2019	96	\N	1	120	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	217
BSCompsci	SOC	2	2018	2019	63	2	3	47	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	115
BSEMC-DA	SOC	2	2018	2019	63	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	63
BSITAreaAnimati	SOC	2	2018	2019	\N	\N	4	77	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	81
BSITAreaNetAdmi	SOC	2	2018	2019	30	7	15	172	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	224
BSITAreaWebDev	SOC	2	2018	2019	82	2	2	116	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	202
BSITMultiTec	SOC	2	2018	2019	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
TOTAL	SOC	2	2018	2019	238	11	24	413	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	686
GRAND TOTAL	HAU	2	2018	2019	3355	56	223	3903	1190	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1426	1684	11837
BForensicSci	CCJEF	1	2019	2020	47	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	49
Criminology	CCJEF	1	2019	2020	83	72	1	19	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	175
TOTAL	CCJEF	1	2019	2020	130	74	1	19	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	224
GS	GS	1	2019	2020	\N	\N	\N	\N	\N	71	78	83	81	83	88	\N	\N	\N	\N	\N	\N	484
TOTAL	GS	1	2019	2020	\N	\N	\N	\N	\N	71	78	83	81	83	88	\N	\N	\N	\N	\N	\N	484
JHS	JHS	1	2019	2020	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	835	899	906	905	\N	\N	3545
TOTAL	JHS	1	2019	2020	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	835	899	906	905	\N	\N	3545
ABComm	SAS	1	2019	2020	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	8
BA Comm	SAS	1	2019	2020	122	111	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	233
BSPsychology	SAS	1	2019	2020	168	116	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	287
TOTAL	SAS	1	2019	2020	290	227	\N	11	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	528
Accountancy	SBA	1	2019	2020	677	665	\N	10	133	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	1486
Accounting Tech	SBA	1	2019	2020	1	\N	\N	52	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	53
BSAcctgInfoSys	SBA	1	2019	2020	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	3
BSBA HRDM	SBA	1	2019	2020	2	2	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7
BSBA-FinMgmt	SBA	1	2019	2020	36	11	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	47
BSBA-HRMgmt	SBA	1	2019	2020	19	17	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	36
BSBA-MktgMgmt	SBA	1	2019	2020	65	77	1	21	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	164
BSBALegal	SBA	1	2019	2020	\N	1	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	3
BusMgt	SBA	1	2019	2020	188	174	2	51	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	415
TOTAL	SBA	1	2019	2020	990	948	3	139	133	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	2214
Architecture	SEA	1	2019	2020	243	220	3	31	267	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	764
BSAeronautical	SEA	1	2019	2020	524	374	\N	26	194	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1118
CE	SEA	1	2019	2020	387	350	1	31	324	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1093
Comp. Eng'g.	SEA	1	2019	2020	39	44	1	4	52	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	140
EE	SEA	1	2019	2020	79	62	1	8	86	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	236
ELECENG	SEA	1	2019	2020	60	66	1	2	91	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	220
IE	SEA	1	2019	2020	37	31	\N	4	91	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	163
ME	SEA	1	2019	2020	118	117	\N	29	191	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	455
TOTAL	SEA	1	2019	2020	1487	1264	7	135	1296	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	4189
BEEd	SED	1	2019	2020	17	12	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	34
BEED-SpecialEdu	SED	1	2019	2020	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
Biological	SED	1	2019	2020	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
BPEd	SED	1	2019	2020	13	14	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	27
BSED-RelValEd	SED	1	2019	2020	10	12	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	22
BSED-ValEd	SED	1	2019	2020	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
BSNEd	SED	1	2019	2020	9	13	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	22
English-BSED	SED	1	2019	2020	39	21	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	62
Fil-BSED	SED	1	2019	2020	9	14	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	23
Math	SED	1	2019	2020	3	13	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	16
Science-BSED	SED	1	2019	2020	11	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	21
SocialStud-BSED	SED	1	2019	2020	13	16	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	32
TOTAL	SED	1	2019	2020	124	125	\N	13	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	262
SHS-ABM	SHS	1	2019	2020	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	272	279	551
SHS-GenAcad	SHS	1	2019	2020	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	204	127	331
SHS-HUMSS	SHS	1	2019	2020	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	177	139	316
SHS-STEM	SHS	1	2019	2020	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	654	678	1332
SHS-TVL-HE	SHS	1	2019	2020	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	163	184	347
TOTAL	SHS	1	2019	2020	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1470	1407	2877
BS EventMgmt	SHTM	1	2019	2020	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
BSBA-HRM	SHTM	1	2019	2020	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
BSCulinary	SHTM	1	2019	2020	3	4	6	24	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	37
BSHM-Accomm	SHTM	1	2019	2020	38	33	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	71
BSHM-Culinary	SHTM	1	2019	2020	60	36	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	97
BSHM-RestFood	SHTM	1	2019	2020	44	21	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	65
BSHRM	SHTM	1	2019	2020	5	21	46	58	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	130
BSTM-DestMgmt	SHTM	1	2019	2020	11	39	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	50
BSTM-Events	SHTM	1	2019	2020	7	12	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	19
BSTM-Travel	SHTM	1	2019	2020	185	73	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	258
BSTourism	SHTM	1	2019	2020	7	7	10	46	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	70
TOTAL	SHTM	1	2019	2020	361	246	62	130	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	799
BS MedTech	SNAMS	1	2019	2020	52	27	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	88
BSNursing	SNAMS	1	2019	2020	93	39	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	132
BSRadTech	SNAMS	1	2019	2020	30	14	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	45
TOTAL	SNAMS	1	2019	2020	175	80	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	265
BSCompsci	SOC	1	2019	2020	75	57	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	134
BSEMC-DA	SOC	1	2019	2020	86	59	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	145
BSITAreaAnimati	SOC	1	2019	2020	\N	\N	1	26	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	27
BSITAreaNetAdmi	SOC	1	2019	2020	70	29	6	61	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	166
BSITAreaWebDev	SOC	1	2019	2020	95	75	1	30	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	201
BSITMultiTec	SOC	1	2019	2020	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
TOTAL	SOC	1	2019	2020	326	220	8	120	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	674
GRAND TOTAL	HAU	1	2019	2020	3883	3184	81	577	1429	71	78	83	81	83	88	835	900	906	905	1470	1407	16061
BForensicSci	CCJEF	2	2019	2020	41	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	48
Criminology	CCJEF	2	2019	2020	75	75	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	152
TOTAL	CCJEF	2	2019	2020	116	82	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	200
AssCompSci	CICT	2	2019	2020	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
TOTAL	CICT	2	2019	2020	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
BA Comm	SAS	2	2019	2020	104	116	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	220
BSPsychology	SAS	2	2019	2020	157	125	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	283
TOTAL	SAS	2	2019	2020	261	241	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	503
Accountancy	SBA	2	2019	2020	647	664	\N	1	133	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1445
Accounting Tech	SBA	2	2019	2020	\N	\N	\N	11	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	11
BSAcctgInfoSys	SBA	2	2019	2020	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	3
BSBA HRDM	SBA	2	2019	2020	\N	1	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	3
BSBA-FinMgmt	SBA	2	2019	2020	33	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	42
BSBA-HRMgmt	SBA	2	2019	2020	21	16	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	37
BSBA-MktgMgmt	SBA	2	2019	2020	66	71	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	144
BSBALegal	SBA	2	2019	2020	4	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	6
BusMgt	SBA	2	2019	2020	179	177	\N	22	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	378
TOTAL	SBA	2	2019	2020	952	939	\N	45	133	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2069
Architecture	SEA	2	2019	2020	226	216	\N	12	294	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	748
BSAeronautical	SEA	2	2019	2020	492	370	\N	4	209	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1075
CE	SEA	2	2019	2020	369	348	\N	5	311	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1033
Comp. Eng'g.	SEA	2	2019	2020	39	41	\N	5	47	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	132
EE	SEA	2	2019	2020	71	62	\N	\N	86	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	219
ELECENG	SEA	2	2019	2020	56	68	\N	\N	92	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	216
IE	SEA	2	2019	2020	35	29	\N	1	77	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	142
ME	SEA	2	2019	2020	115	108	\N	17	195	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	435
TOTAL	SEA	2	2019	2020	1403	1242	\N	44	1311	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	4000
BEEd	SED	2	2019	2020	15	12	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	31
BEED-SpecialEdu	SED	2	2019	2020	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
Biological	SED	2	2019	2020	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
BPEd	SED	2	2019	2020	13	14	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	27
BSED-RelValEd	SED	2	2019	2020	7	12	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	19
BSNEd	SED	2	2019	2020	8	13	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	21
English-BSED	SED	2	2019	2020	36	21	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	57
Fil-BSED	SED	2	2019	2020	7	13	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	20
Math	SED	2	2019	2020	1	13	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	14
Science-BSED	SED	2	2019	2020	9	11	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	20
SocialStud-BSED	SED	2	2019	2020	11	17	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	29
TOTAL	SED	2	2019	2020	107	126	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	240
SHS-ABM	SHS	2	2019	2020	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	267	277	544
SHS-GenAcad	SHS	2	2019	2020	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	203	126	329
SHS-HUMSS	SHS	2	2019	2020	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	176	140	316
SHS-STEM	SHS	2	2019	2020	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	652	673	1325
SHS-TVL-HE	SHS	2	2019	2020	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	159	184	343
TOTAL	SHS	2	2019	2020	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1457	1400	2857
BS EventMgmt	SHTM	2	2019	2020	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
BSCulinary	SHTM	2	2019	2020	3	3	4	11	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	21
BSHM-Accomm	SHTM	2	2019	2020	34	34	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	68
BSHM-Culinary	SHTM	2	2019	2020	51	36	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	88
BSHM-RestFood	SHTM	2	2019	2020	39	22	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	61
BSHRM	SHTM	2	2019	2020	1	11	34	49	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	95
BSTM-DestMgmt	SHTM	2	2019	2020	12	23	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	35
BSTM-Events	SHTM	2	2019	2020	8	11	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	19
BSTM-Travel	SHTM	2	2019	2020	176	92	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	268
BSTourism	SHTM	2	2019	2020	7	3	8	26	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	44
TOTAL	SHTM	2	2019	2020	332	235	46	87	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	700
BS MedTech	SNAMS	2	2019	2020	44	26	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	80
BSNursing	SNAMS	2	2019	2020	81	40	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	121
BSRadTech	SNAMS	2	2019	2020	29	13	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	43
TOTAL	SNAMS	2	2019	2020	154	79	\N	11	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	244
BSCompsci	SOC	2	2019	2020	75	55	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	132
BSEMC-DA	SOC	2	2019	2020	76	58	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	134
BSITAreaAnimati	SOC	2	2019	2020	\N	\N	\N	12	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	12
BSITAreaNetAdmi	SOC	2	2019	2020	66	29	\N	34	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	129
BSITAreaWebDev	SOC	2	2019	2020	81	74	1	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	163
TOTAL	SOC	2	2019	2020	298	216	1	55	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	570
GRAND TOTAL	HAU	2	2019	2020	3624	3160	47	252	1444	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1457	1400	11384
BForensicSci	CCJEF	1	2020	2021	34	45	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	79
BS Criminology	CCJEF	1	2020	2021	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	3
Criminology	CCJEF	1	2020	2021	56	68	58	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	182
TOTAL	CCJEF	1	2020	2021	93	113	58	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	264
GS	GS	1	2020	2021	\N	\N	\N	\N	\N	39	50	69	67	65	76	\N	\N	\N	\N	\N	\N	366
TOTAL	GS	1	2020	2021	\N	\N	\N	\N	\N	39	50	69	67	65	76	\N	\N	\N	\N	\N	\N	366
JHS	JHS	1	2020	2021	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	458	714	799	829	1	\N	2801
TOTAL	JHS	1	2020	2021	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	458	714	799	829	1	\N	2801
BA Comm	SAS	1	2020	2021	68	98	85	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	251
BSPsychology	SAS	1	2020	2021	135	142	99	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	376
TOTAL	SAS	1	2020	2021	203	240	184	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	627
Accountancy	SBA	1	2020	2021	524	598	630	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	1	\N	\N	1754
Accounting Tech	SBA	1	2020	2021	1	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	4
BSAcctgInfoSys	SBA	1	2020	2021	1	1	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	3
BSBA-FinMgmt	SBA	1	2020	2021	22	31	9	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	63
BSBA-HRMgmt	SBA	1	2020	2021	9	18	16	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	43
BSBA-MktgMgmt	SBA	1	2020	2021	60	51	63	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	177
BSBALegal	SBA	1	2020	2021	14	3	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	19
BSBAMgmtAcctg	SBA	1	2020	2021	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
BusMgt	SBA	1	2020	2021	159	170	160	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	495
TOTAL	SBA	1	2020	2021	790	872	880	15	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	1	\N	\N	2559
Architecture	SEA	1	2020	2021	155	198	199	3	57	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	612
BSAeronautical	SEA	1	2020	2021	391	436	349	\N	42	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1218
CE	SEA	1	2020	2021	265	350	299	\N	68	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	982
Comp. Eng'g.	SEA	1	2020	2021	59	32	42	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	139
EE	SEA	1	2020	2021	42	70	52	\N	17	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	181
ELECENG	SEA	1	2020	2021	54	58	66	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	179
IE	SEA	1	2020	2021	34	32	28	\N	13	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	107
ME	SEA	1	2020	2021	88	99	100	\N	43	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	330
TOTAL	SEA	1	2020	2021	1088	1275	1135	3	247	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	3748
BEEd	SED	1	2020	2021	14	11	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	35
BPEd	SED	1	2020	2021	6	11	13	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	30
BSED-RelValEd	SED	1	2020	2021	3	1	11	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	15
BSNEd	SED	1	2020	2021	3	16	13	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	32
English-BSED	SED	1	2020	2021	28	25	19	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	72
Fil-BSED	SED	1	2020	2021	12	1	11	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	24
Math	SED	1	2020	2021	5	\N	11	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	16
Science-BSED	SED	1	2020	2021	7	17	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	33
SocialStud-BSED	SED	1	2020	2021	5	20	17	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	42
TOTAL	SED	1	2020	2021	83	102	114	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	299
SHS-ABM	SHS	1	2020	2021	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	260	263	523
SHS-GenAcad	SHS	1	2020	2021	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	103	184	287
SHS-HUMSS	SHS	1	2020	2021	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	174	172	346
SHS-STEM	SHS	1	2020	2021	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	743	629	1372
SHS-TVL-HE	SHS	1	2020	2021	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	93	141	234
SHS-TVL-ICT	SHS	1	2020	2021	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	82	\N	82
TOTAL	SHS	1	2020	2021	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1455	1389	2844
BS EventMgmt	SHTM	1	2020	2021	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
BSCulinary	SHTM	1	2020	2021	1	1	3	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	10
BSHM-Accomm	SHTM	1	2020	2021	8	32	32	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	72
BSHM-Culinary	SHTM	1	2020	2021	48	44	30	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	122
BSHM-RestFood	SHTM	1	2020	2021	35	20	15	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	70
BSHRM	SHTM	1	2020	2021	1	7	13	34	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	55
BSTM-DestMgmt	SHTM	1	2020	2021	7	6	38	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	51
BSTM-Events	SHTM	1	2020	2021	1	4	11	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	16
BSTM-Travel	SHTM	1	2020	2021	148	155	69	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	372
BSTourism	SHTM	1	2020	2021	1	5	3	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	19
TOTAL	SHTM	1	2020	2021	251	274	214	49	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	788
BS MedTech	SNAMS	1	2020	2021	45	38	18	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	101
BSNursing	SNAMS	1	2020	2021	97	69	36	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	202
BSRadTech	SNAMS	1	2020	2021	19	27	12	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	58
TOTAL	SNAMS	1	2020	2021	161	134	66	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	361
BSCompsci	SOC	1	2020	2021	51	68	46	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	165
BSCybersecurity	SOC	1	2020	2021	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
BSEMC-DA	SOC	1	2020	2021	47	68	46	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	161
BSInfoTech	SOC	1	2020	2021	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
BSITAreaAnimati	SOC	1	2020	2021	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
BSITAreaNetAdmi	SOC	1	2020	2021	38	48	21	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	113
BSITAreaWebDev	SOC	1	2020	2021	78	72	59	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	209
TOTAL	SOC	1	2020	2021	216	256	172	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	651
GRAND TOTAL	HAU	1	2020	2021	2885	3266	2823	74	247	39	50	69	67	65	76	458	714	800	830	1456	1389	15308
BForensicSci	CCJEF	2	2020	2021	28	44	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	73
BS Criminology	CCJEF	2	2020	2021	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2
Criminology	CCJEF	2	2020	2021	45	60	59	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	164
TOTAL	CCJEF	2	2020	2021	75	104	60	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	239
BA Comm	SAS	2	2020	2021	60	84	93	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	237
BSPsychology	SAS	2	2020	2021	120	141	105	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	366
TOTAL	SAS	2	2020	2021	180	225	198	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	603
Accountancy	SBA	2	2020	2021	502	584	551	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1638
BSAcctgInfoSys	SBA	2	2020	2021	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
BSBA-FinMgmt	SBA	2	2020	2021	22	35	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	66
BSBA-HRMgmt	SBA	2	2020	2021	10	17	16	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	43
BSBA-MktgMgmt	SBA	2	2020	2021	60	46	62	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	168
BSBALegal	SBA	2	2020	2021	15	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	17
BSIntAuditing	SBA	2	2020	2021	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2
BSBAMgmtAcctg	SBA	2	2020	2021	2	1	72	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	75
BusMgt	SBA	2	2020	2021	150	158	160	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	470
TOTAL	SBA	2	2020	2021	761	844	872	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2480
Architecture	SEA	2	2020	2021	133	194	188	\N	54	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	569
BSAeronautical	SEA	2	2020	2021	366	429	351	\N	18	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1164
CE	SEA	2	2020	2021	240	332	294	\N	18	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	884
Comp. Eng'g.	SEA	2	2020	2021	51	29	41	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	122
EE	SEA	2	2020	2021	35	61	53	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	152
ELECENG	SEA	2	2020	2021	57	56	65	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	179
IE	SEA	2	2020	2021	29	34	28	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	94
ME	SEA	2	2020	2021	76	95	106	\N	30	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	307
TOTAL	SEA	2	2020	2021	987	1230	1126	\N	128	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	3471
BEEd	SED	2	2020	2021	10	12	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	32
BPEd	SED	2	2020	2021	6	11	13	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	30
BSED-RelValEd	SED	2	2020	2021	2	\N	12	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	14
BSNEd	SED	2	2020	2021	4	14	12	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	30
English-BSED	SED	2	2020	2021	28	25	19	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	72
Fil-BSED	SED	2	2020	2021	10	1	11	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	22
Math	SED	2	2020	2021	5	\N	11	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	16
Science-BSED	SED	2	2020	2021	7	14	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	30
SocialStud-BSED	SED	2	2020	2021	3	19	17	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	39
TOTAL	SED	2	2020	2021	75	96	114	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	285
SHS-ABM	SHS	2	2020	2021	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	255	262	517
SHS-GenAcad	SHS	2	2020	2021	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	95	181	276
SHS-HUMSS	SHS	2	2020	2021	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	170	173	343
SHS-STEM	SHS	2	2020	2021	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	729	624	1353
SHS-TVL-HE	SHS	2	2020	2021	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	91	136	227
SHS-TVL-ICT	SHS	2	2020	2021	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	78	\N	78
TOTAL	SHS	2	2020	2021	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1418	1376	2794
BS EventMgmt	SHTM	2	2020	2021	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
BSCulinary	SHTM	2	2020	2021	1	1	1	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	8
BSHM-Accomm	SHTM	2	2020	2021	9	30	37	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	76
BSHM-Culinary	SHTM	2	2020	2021	49	40	30	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	119
BSHM-RestFood	SHTM	2	2020	2021	28	14	15	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	57
BSHRM	SHTM	2	2020	2021	1	1	10	13	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	25
BSTM-DestMgmt	SHTM	2	2020	2021	3	6	37	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	46
BSTM-Events	SHTM	2	2020	2021	1	4	12	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	17
BSTM-Travel	SHTM	2	2020	2021	131	149	73	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	353
BSTourism	SHTM	2	2020	2021	1	4	2	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	10
TOTAL	SHTM	2	2020	2021	225	249	217	21	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	712
BS MedTech	SNAMS	2	2020	2021	34	37	17	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	88
BSNursing	SNAMS	2	2020	2021	82	66	36	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	184
BSRadTech	SNAMS	2	2020	2021	20	25	12	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	57
TOTAL	SNAMS	2	2020	2021	136	128	65	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	329
BSCompsci	SOC	2	2020	2021	50	65	46	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	161
BSEMC-DA	SOC	2	2020	2021	41	55	46	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	142
BSITAreaAnimati	SOC	2	2020	2021	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
BSITAreaNetAdmi	SOC	2	2020	2021	24	38	23	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	90
BSITAreaWebDev	SOC	2	2020	2021	81	64	57	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	203
TOTAL	SOC	2	2020	2021	196	222	172	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	597
GRAND TOTAL	HAU	2	2020	2021	2635	3098	2824	31	128	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1418	1376	11510
BForensicSci	CCJEF	1	2021	2022	22	33	41	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	96
BS Criminology	CCJEF	1	2021	2022	1	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2
Criminology	CCJEF	1	2021	2022	60	45	56	56	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	217
TOTAL	CCJEF	1	2021	2022	83	79	97	56	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	315
GS	GS	1	2021	2022	\N	\N	\N	\N	\N	\N	44	56	80	70	72	\N	\N	\N	\N	\N	\N	322
TOTAL	GS	1	2021	2022	\N	\N	\N	\N	\N	\N	44	56	80	70	72	\N	\N	\N	\N	\N	\N	322
JHS	JHS	1	2021	2022	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	354	451	669	786	\N	\N	2260
TOTAL	JHS	1	2021	2022	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	354	451	669	786	\N	\N	2260
ABPsychology	SAS	1	2021	2022	19	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	19
BA Comm	SAS	1	2021	2022	46	71	82	84	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	283
BSPsychology	SAS	1	2021	2022	125	136	119	98	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	478
TOTAL	SAS	1	2021	2022	190	207	201	182	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	780
Accountancy	SBA	1	2021	2022	455	451	249	174	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1329
Accounting Tech	SBA	1	2021	2022	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
BSBA-FinMgmt	SBA	1	2021	2022	32	29	31	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	101
BSBA-HRMgmt	SBA	1	2021	2022	13	9	13	16	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	51
BSBA-MktgMgmt	SBA	1	2021	2022	52	63	46	58	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	219
BSBALegal	SBA	1	2021	2022	36	17	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	54
BSIntAuditing	SBA	1	2021	2022	\N	\N	18	21	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	39
BSBAMgmtAcctg	SBA	1	2021	2022	4	5	296	425	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	730
BusMgt	SBA	1	2021	2022	167	155	155	155	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	632
TOTAL	SBA	1	2021	2022	759	729	809	859	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	3156
Architecture	SEA	1	2021	2022	237	125	187	179	18	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	746
BSAeronautical	SEA	1	2021	2022	346	353	416	346	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1464
BSCE-CEM	SEA	1	2021	2022	\N	\N	\N	151	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	151
BSCE-SE	SEA	1	2021	2022	\N	\N	\N	92	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	92
BSCE-TE	SEA	1	2021	2022	\N	\N	\N	33	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	33
CE	SEA	1	2021	2022	314	238	341	6	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	902
Comp. Eng'g.	SEA	1	2021	2022	78	42	36	34	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	190
EE	SEA	1	2021	2022	31	36	63	51	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	182
ELECENG	SEA	1	2021	2022	30	60	56	62	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	208
IE	SEA	1	2021	2022	12	30	31	29	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	102
ME	SEA	1	2021	2022	114	77	105	92	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	392
TOTAL	SEA	1	2021	2022	1162	961	1235	1075	29	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	4462
BEEd	SED	1	2021	2022	23	12	12	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	57
BPEd	SED	1	2021	2022	6	\N	11	12	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	29
BSED-RelValEd	SED	1	2021	2022	2	2	1	11	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	16
BSED-ValEd	SED	1	2021	2022	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
BSNEd	SED	1	2021	2022	6	1	13	12	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	32
English-BSED	SED	1	2021	2022	11	33	24	19	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	87
Fil-BSED	SED	1	2021	2022	6	13	2	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	31
Math	SED	1	2021	2022	9	1	\N	11	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	21
Science-BSED	SED	1	2021	2022	1	8	14	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	32
SocialStud-BSED	SED	1	2021	2022	5	1	17	16	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	39
TOTAL	SED	1	2021	2022	70	71	94	110	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	345
SHS-ABM	SHS	1	2021	2022	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	290	255	545
SHS-GenAcad	SHS	1	2021	2022	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	52	96	148
SHS-HUMSS	SHS	1	2021	2022	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	138	170	308
SHS-STEM	SHS	1	2021	2022	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	714	732	1446
SHS-TVL-HE	SHS	1	2021	2022	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	82	94	176
SHS-TVL-ICT	SHS	1	2021	2022	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	66	80	146
TOTAL	SHS	1	2021	2022	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1342	1427	2769
BS EventMgmt	SHTM	1	2021	2022	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
BSCulinary	SHTM	1	2021	2022	1	2	1	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	6
BSHM-Accomm	SHTM	1	2021	2022	18	18	27	32	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	95
BSHM-Culinary	SHTM	1	2021	2022	49	53	42	27	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	171
BSHM-RestFood	SHTM	1	2021	2022	27	26	11	14	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	78
BSHRM	SHTM	1	2021	2022	1	3	4	12	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	20
BSTM-DestMgmt	SHTM	1	2021	2022	5	2	7	35	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	49
BSTM-Events	SHTM	1	2021	2022	4	1	5	11	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	21
BSTM-Travel	SHTM	1	2021	2022	127	124	141	67	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	459
BSTourism	SHTM	1	2021	2022	1	2	2	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	8
TOTAL	SHTM	1	2021	2022	233	232	240	203	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	908
BS MedTech	SNAMS	1	2021	2022	54	33	31	13	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	131
BSNursing	SNAMS	1	2021	2022	170	77	59	36	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	342
BSRadTech	SNAMS	1	2021	2022	36	19	22	11	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	88
TOTAL	SNAMS	1	2021	2022	260	129	112	60	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	561
BSCompsci	SOC	1	2021	2022	77	57	57	45	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	236
BSCyberplusPSM	SOC	1	2021	2022	13	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	13
BSCybersecurity	SOC	1	2021	2022	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	4
BSEMC-DA	SOC	1	2021	2022	78	55	56	43	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	232
BSITAreaAnimati	SOC	1	2021	2022	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2
BSITAreaNetAdmi	SOC	1	2021	2022	58	31	39	19	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	147
BSITAreaWebDev	SOC	1	2021	2022	94	76	63	51	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	284
TOTAL	SOC	1	2021	2022	324	219	215	160	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	918
GRAND TOTAL	HAU	1	2021	2022	3081	2627	3003	2705	29	\N	44	56	80	70	72	354	451	669	786	1342	1427	16796
BForensicSci	CCJEF	2	2021	2022	19	34	40	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	93
BS Criminology	CCJEF	2	2021	2022	1	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2
Criminology	CCJEF	2	2021	2022	51	47	60	53	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	211
TOTAL	CCJEF	2	2021	2022	71	82	100	53	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	306
ABPsychology	SAS	2	2021	2022	19	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	19
BA Comm	SAS	2	2021	2022	47	65	83	85	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	280
BSPsychology	SAS	2	2021	2022	114	116	133	98	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	461
TOTAL	SAS	2	2021	2022	180	181	216	183	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	760
Accountancy	SBA	2	2021	2022	422	423	226	137	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1208
BSBA-FinMgmt	SBA	2	2021	2022	28	30	32	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	91
BSBA-HRMgmt	SBA	2	2021	2022	11	10	12	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	35
BSBA-MktgMgmt	SBA	2	2021	2022	46	56	46	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	155
BSBALegal	SBA	2	2021	2022	32	19	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	52
BSIntAuditing	SBA	2	2021	2022	\N	\N	20	20	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	40
BSBAMgmtAcctg	SBA	2	2021	2022	6	4	316	459	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	785
BusMgt	SBA	2	2021	2022	155	157	150	22	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	484
TOTAL	SBA	2	2021	2022	700	699	803	648	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2850
Architecture	SEA	2	2021	2022	198	125	181	177	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	690
BSAeronautical	SEA	2	2021	2022	314	350	414	343	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1424
BSCE-CEM	SEA	2	2021	2022	\N	\N	\N	149	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	149
BSCE-SE	SEA	2	2021	2022	\N	\N	\N	92	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	92
BSCE-TE	SEA	2	2021	2022	\N	\N	\N	33	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	33
CE	SEA	2	2021	2022	300	225	333	14	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	874
Comp. Eng'g.	SEA	2	2021	2022	76	41	31	36	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	184
EE	SEA	2	2021	2022	31	37	61	53	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	183
ELECENG	SEA	2	2021	2022	24	59	55	61	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	199
IE	SEA	2	2021	2022	7	31	30	28	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	96
ME	SEA	2	2021	2022	91	78	100	96	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	366
TOTAL	SEA	2	2021	2022	1041	946	1205	1082	16	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	4290
BEEd	SED	2	2021	2022	29	12	11	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	62
BPEd	SED	2	2021	2022	\N	\N	10	12	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	22
BSED-RelValEd	SED	2	2021	2022	7	1	1	11	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	20
BSNEd	SED	2	2021	2022	3	\N	14	12	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	29
English-BSED	SED	2	2021	2022	12	33	23	19	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	87
Fil-BSED	SED	2	2021	2022	3	13	2	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	28
Math	SED	2	2021	2022	9	\N	\N	11	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	20
Science-BSED	SED	2	2021	2022	1	9	14	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	33
SocialStud-BSED	SED	2	2021	2022	3	1	17	16	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	37
TOTAL	SED	2	2021	2022	67	69	92	110	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	338
SHS-ABM	SHS	2	2021	2022	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	287	255	542
SHS-GenAcad	SHS	2	2021	2022	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	52	98	150
SHS-HUMSS	SHS	2	2021	2022	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	133	169	302
SHS-STEM	SHS	2	2021	2022	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	705	727	1432
SHS-TVL-HE	SHS	2	2021	2022	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	80	93	173
SHS-TVL-ICT	SHS	2	2021	2022	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	69	80	149
TOTAL	SHS	2	2021	2022	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1326	1422	2748
BSCulinary	SHTM	2	2021	2022	1	2	1	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	6
BSHM-Accomm	SHTM	2	2021	2022	16	17	30	32	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	95
BSHM-Culinary	SHTM	2	2021	2022	48	47	42	28	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	165
BSHM-RestFood	SHTM	2	2021	2022	28	24	12	14	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	78
BSHRM	SHTM	2	2021	2022	\N	2	2	6	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	11
BSTM-DestMgmt	SHTM	2	2021	2022	6	\N	6	37	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	49
BSTM-Events	SHTM	2	2021	2022	4	1	4	12	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	21
BSTM-Travel	SHTM	2	2021	2022	127	121	147	68	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	463
BSTourism	SHTM	2	2021	2022	\N	1	1	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	3
TOTAL	SHTM	2	2021	2022	230	215	245	200	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	891
BS MedTech	SNAMS	2	2021	2022	33	25	24	13	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	95
BSNursing	SNAMS	2	2021	2022	169	76	59	36	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	340
BSRadTech	SNAMS	2	2021	2022	33	14	25	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	81
TOTAL	SNAMS	2	2021	2022	235	115	108	58	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	516
BSCompsci	SOC	2	2021	2022	69	49	64	45	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	227
BSCyberplusPSM	SOC	2	2021	2022	14	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	14
BSCybersecurity	SOC	2	2021	2022	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	4
BSEMC-DA	SOC	2	2021	2022	71	51	55	45	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	222
BSITAreaAnimati	SOC	2	2021	2022	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	3
BSITAreaNetAdmi	SOC	2	2021	2022	48	28	40	19	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	135
BSITAreaWebDev	SOC	2	2021	2022	93	69	62	57	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	281
TOTAL	SOC	2	2021	2022	299	197	221	169	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	886
GRAND TOTAL	HAU	2	2021	2022	2823	2504	2990	2503	17	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1326	1422	13585
BForensicSci	CCJEF	1	2022	2023	40	17	29	41	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	127
BS Criminology	CCJEF	1	2022	2023	\N	1	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2
Criminology	CCJEF	1	2022	2023	80	51	55	57	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	243
TOTAL	CCJEF	1	2022	2023	120	69	85	98	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	372
GS	GS	1	2022	2023	\N	\N	\N	\N	\N	\N	\N	55	68	94	91	\N	\N	\N	\N	\N	\N	308
TOTAL	GS	1	2022	2023	\N	\N	\N	\N	\N	\N	\N	55	68	94	91	\N	\N	\N	\N	\N	\N	308
JHS	JHS	1	2022	2023	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	414	386	498	685	\N	\N	1983
TOTAL	JHS	1	2022	2023	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	414	386	498	685	\N	\N	1983
ABPsychology	SAS	1	2022	2023	41	19	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	60
BA Comm	SAS	1	2022	2023	46	60	72	79	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	257
BSPsychology	SAS	1	2022	2023	98	111	137	119	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	465
TOTAL	SAS	1	2022	2023	185	190	209	198	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	782
Accountancy	SBA	1	2022	2023	422	383	396	221	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	1423
BSBA-FinMgmt	SBA	1	2022	2023	37	28	32	31	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	128
BSBA-HRMgmt	SBA	1	2022	2023	7	13	9	12	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	41
BSBA-MktgMgmt	SBA	1	2022	2023	62	56	54	45	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	217
BSBALegal	SBA	1	2022	2023	37	34	19	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	90
BSIntAuditing	SBA	1	2022	2023	1	\N	\N	21	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	22
BSBAMgmtAcctg	SBA	1	2022	2023	19	6	25	327	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	377
BusMgt	SBA	1	2022	2023	163	164	141	146	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	614
TOTAL	SBA	1	2022	2023	748	684	676	803	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	2912
Architecture	SEA	1	2022	2023	202	168	130	185	169	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	854
BSAeronautical	SEA	1	2022	2023	318	308	349	424	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1399
BSCE-CEM	SEA	1	2022	2023	\N	\N	\N	178	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	178
BSCE-SE	SEA	1	2022	2023	\N	\N	\N	122	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	122
BSCE-TE	SEA	1	2022	2023	\N	\N	\N	57	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	57
CE	SEA	1	2022	2023	285	301	230	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	822
Comp. Eng'g.	SEA	1	2022	2023	94	73	38	38	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	243
EE	SEA	1	2022	2023	42	29	37	63	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	171
ELECENG	SEA	1	2022	2023	40	25	58	59	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	182
IE	SEA	1	2022	2023	35	11	30	32	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	109
ME	SEA	1	2022	2023	91	90	75	105	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	361
TOTAL	SEA	1	2022	2023	1107	1005	947	1269	170	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	4498
BEEd	SED	1	2022	2023	17	28	15	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	67
BPEd	SED	1	2022	2023	3	\N	1	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	12
BSED-RelValEd	SED	1	2022	2023	3	11	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	15
BSNEd	SED	1	2022	2023	6	\N	2	12	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	20
English-BSED	SED	1	2022	2023	25	13	32	22	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	92
Fil-BSED	SED	1	2022	2023	7	\N	11	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	20
Math	SED	1	2022	2023	3	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	12
Science-BSED	SED	1	2022	2023	6	\N	9	14	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	29
SocialStud-BSED	SED	1	2022	2023	5	\N	\N	18	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	23
TOTAL	SED	1	2022	2023	75	61	70	84	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	290
SHS-ABM	SHS	1	2022	2023	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	270	286	556
SHS-GenAcad	SHS	1	2022	2023	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	34	56	90
SHS-HUMSS	SHS	1	2022	2023	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	177	147	324
SHS-STEM	SHS	1	2022	2023	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	798	710	1508
SHS-TVL-HE	SHS	1	2022	2023	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	63	75	139
SHS-TVL-ICT	SHS	1	2022	2023	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	106	72	178
TOTAL	SHS	1	2022	2023	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1448	1346	2795
BSCulinary	SHTM	1	2022	2023	\N	\N	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	3
BSHM-Accomm	SHTM	1	2022	2023	10	17	19	29	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	75
BSHM-Culinary	SHTM	1	2022	2023	93	49	48	44	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	234
BSHM-RestFood	SHTM	1	2022	2023	36	28	21	13	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	98
BSHRM	SHTM	1	2022	2023	\N	\N	2	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	8
BSInterGastro	SHTM	1	2022	2023	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	3
BSTM-DestMgmt	SHTM	1	2022	2023	11	3	1	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	20
BSTM-Events	SHTM	1	2022	2023	5	4	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	14
BSTM-Travel	SHTM	1	2022	2023	121	126	113	145	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	505
BSTourism	SHTM	1	2022	2023	\N	1	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	3
TOTAL	SHTM	1	2022	2023	279	228	206	250	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	963
BS MedTech	SNAMS	1	2022	2023	100	26	21	22	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	169
BSNursing	SNAMS	1	2022	2023	198	152	73	54	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	477
BSRadTech	SNAMS	1	2022	2023	28	29	12	24	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	93
TOTAL	SNAMS	1	2022	2023	326	207	106	100	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	739
BSCompsci	SOC	1	2022	2023	109	60	55	57	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	281
BSCyberplusPSM	SOC	1	2022	2023	12	16	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	28
BSCybersecurity	SOC	1	2022	2023	17	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	24
BSEMC-DA	SOC	1	2022	2023	73	76	46	56	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	251
BSITAreaAnimati	SOC	1	2022	2023	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
BSITAreaNetAdmi	SOC	1	2022	2023	46	28	28	38	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	140
BSITAreaWebDev	SOC	1	2022	2023	102	95	71	64	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	332
TOTAL	SOC	1	2022	2023	359	282	200	216	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1057
GRAND TOTAL	HAU	1	2022	2023	3200	2726	2499	3018	170	\N	\N	55	68	94	91	415	386	498	685	1448	1346	16699
BForensicSci	CCJEF	2	2022	2023	36	19	29	41	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	125
Criminology	CCJEF	2	2022	2023	73	55	52	58	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	238
TOTAL	CCJEF	2	2022	2023	109	74	81	99	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	363
HAUSPELLSP	HAUSPELL	2	2022	2023	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
TOTAL	HAUSPELL	2	2022	2023	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
ABComm	SAS	2	2022	2023	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
ABPsychology	SAS	2	2022	2023	33	20	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	53
BA Comm	SAS	2	2022	2023	48	64	69	77	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	258
BSPsychology	SAS	2	2022	2023	80	112	128	121	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	441
TOTAL	SAS	2	2022	2023	162	196	197	198	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	753
Accountancy	SBA	2	2022	2023	392	369	394	217	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1372
BSBA-FinMgmt	SBA	2	2022	2023	33	26	28	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	89
BSBA-HRMgmt	SBA	2	2022	2023	9	10	9	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	29
BSBA-MktgMgmt	SBA	2	2022	2023	59	51	52	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	167
BSBALegal	SBA	2	2022	2023	31	30	19	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	80
BSIntAuditing	SBA	2	2022	2023	1	\N	\N	21	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	22
BSBAMgmtAcctg	SBA	2	2022	2023	16	7	24	326	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	373
BusMgt	SBA	2	2022	2023	152	149	142	36	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	479
TOTAL	SBA	2	2022	2023	693	642	668	608	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2611
Architecture	SEA	2	2022	2023	183	168	130	185	169	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	835
BSAeronautical	SEA	2	2022	2023	302	292	348	413	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1356
BSCE-CEM	SEA	2	2022	2023	\N	\N	\N	171	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	171
BSCE-SE	SEA	2	2022	2023	\N	\N	\N	119	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	119
BSCE-TE	SEA	2	2022	2023	\N	\N	\N	50	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	50
CE	SEA	2	2022	2023	262	287	228	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	787
Comp. Eng'g.	SEA	2	2022	2023	85	71	40	36	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	232
ECE	SEA	2	2022	2023	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
EE	SEA	2	2022	2023	39	24	34	61	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	158
ELECENG	SEA	2	2022	2023	37	24	57	57	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	175
IE	SEA	2	2022	2023	33	9	31	33	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	106
ME	SEA	2	2022	2023	84	85	73	105	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	347
TOTAL	SEA	2	2022	2023	1026	960	941	1240	170	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	4337
BEEd	SED	2	2022	2023	15	28	14	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	64
BPEd	SED	2	2022	2023	3	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	10
BSED-RelValEd	SED	2	2022	2023	3	9	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	13
BSNEd	SED	2	2022	2023	5	\N	1	12	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	18
English-BSED	SED	2	2022	2023	21	13	32	22	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	88
Fil-BSED	SED	2	2022	2023	7	1	11	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	21
Math	SED	2	2022	2023	4	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	12
Science-BSED	SED	2	2022	2023	5	\N	9	13	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	27
SocialStud-BSED	SED	2	2022	2023	4	\N	\N	18	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	22
TOTAL	SED	2	2022	2023	67	59	67	82	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	275
SHS-ABM	SHS	2	2022	2023	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	268	283	551
SHS-GenAcad	SHS	2	2022	2023	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	34	53	87
SHS-HUMSS	SHS	2	2022	2023	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	178	141	319
SHS-STEM	SHS	2	2022	2023	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	783	711	1494
SHS-TVL-HE	SHS	2	2022	2023	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	61	72	133
SHS-TVL-ICT	SHS	2	2022	2023	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	107	70	177
TOTAL	SHS	2	2022	2023	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1431	1330	2761
BSCulinary	SHTM	2	2022	2023	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
BSHM-Accomm	SHTM	2	2022	2023	9	20	18	25	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	72
BSHM-Culinary	SHTM	2	2022	2023	94	50	49	40	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	233
BSHM-RestFood	SHTM	2	2022	2023	32	25	22	13	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	92
BSHRM	SHTM	2	2022	2023	1	\N	1	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7
BSInterGastro	SHTM	2	2022	2023	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2
BSTM-DestMgmt	SHTM	2	2022	2023	6	2	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	12
BSTM-Events	SHTM	2	2022	2023	5	4	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	13
BSTM-Travel	SHTM	2	2022	2023	118	123	116	142	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	499
BSTourism	SHTM	2	2022	2023	\N	1	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2
TOTAL	SHTM	2	2022	2023	267	225	206	235	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	933
BS MedTech	SNAMS	2	2022	2023	85	26	17	22	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	150
BSNursing	SNAMS	2	2022	2023	185	142	76	54	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	457
BSRadTech	SNAMS	2	2022	2023	27	27	13	22	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	89
TOTAL	SNAMS	2	2022	2023	297	195	106	98	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	696
BSCompsci	SOC	2	2022	2023	101	56	53	60	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	270
BSCyberplusPSM	SOC	2	2022	2023	11	14	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	25
BSCybersecurity	SOC	2	2022	2023	17	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	25
BSEMC-DA	SOC	2	2022	2023	64	70	46	55	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	235
BSITAreaNetAdmi	SOC	2	2022	2023	41	24	26	38	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	129
BSITAreaWebDev	SOC	2	2022	2023	90	93	67	64	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	314
TOTAL	SOC	2	2022	2023	324	265	192	217	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	998
GRAND TOTAL	HAU	2	2022	2023	2946	2616	2458	2777	170	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1431	1330	13728
BForensicSci	CCJEF	1	2023	2024	58	37	17	27	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	139
Criminology	CCJEF	1	2023	2024	49	72	51	49	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	221
TOTAL	CCJEF	1	2023	2024	107	109	68	76	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	360
GS	GS	1	2023	2024	\N	\N	\N	\N	\N	\N	\N	\N	68	77	91	\N	\N	\N	\N	\N	\N	236
TOTAL	GS	1	2023	2024	\N	\N	\N	\N	\N	\N	\N	\N	68	77	91	\N	\N	\N	\N	\N	\N	236
JHS	JHS	1	2023	2024	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	399	429	415	542	\N	\N	1785
TOTAL	JHS	1	2023	2024	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	399	429	415	542	\N	\N	1785
ABPsychology	SAS	1	2023	2024	39	33	18	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	90
BA Comm	SAS	1	2023	2024	74	49	53	66	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	242
BSPsychology	SAS	1	2023	2024	87	85	99	129	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	400
TOTAL	SAS	1	2023	2024	200	167	170	195	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	732
Accountancy	SBA	1	2023	2024	343	363	359	14	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1079
BSBA-FinMgmt	SBA	1	2023	2024	23	37	20	27	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	107
BSBA-HRMgmt	SBA	1	2023	2024	12	12	11	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	41
BSBA-MktgMgmt	SBA	1	2023	2024	82	56	62	44	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	244
BSBALegal	SBA	1	2023	2024	32	32	28	17	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	109
BSIntAuditing	SBA	1	2023	2024	2	1	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	5
BSBAMgmtAcctg	SBA	1	2023	2024	58	25	15	398	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	496
BusMgt	SBA	1	2023	2024	122	151	152	132	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	557
TOTAL	SBA	1	2023	2024	674	677	647	640	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2638
Architecture	SEA	1	2023	2024	163	178	160	130	187	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	818
BSAeronautical	SEA	1	2023	2024	266	287	289	389	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1231
BSCE-CEM	SEA	1	2023	2024	\N	\N	\N	119	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	119
BSCE-SE	SEA	1	2023	2024	\N	\N	\N	70	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	70
BSCE-TE	SEA	1	2023	2024	1	\N	\N	49	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	50
CE	SEA	1	2023	2024	179	266	274	19	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	738
Comp. Eng'g.	SEA	1	2023	2024	103	85	63	39	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	290
EE	SEA	1	2023	2024	22	31	23	47	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	123
ELECENG	SEA	1	2023	2024	22	39	29	53	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	143
IE	SEA	1	2023	2024	80	32	11	31	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	154
ME	SEA	1	2023	2024	81	80	81	76	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	318
TOTAL	SEA	1	2023	2024	917	998	930	1022	187	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	4054
BEEd	SED	1	2023	2024	11	23	26	14	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	74
BPEd	SED	1	2023	2024	2	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	3
BSED-RelValEd	SED	1	2023	2024	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	9
BSNEd	SED	1	2023	2024	2	19	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	22
English-BSED	SED	1	2023	2024	20	19	13	30	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	82
Fil-BSED	SED	1	2023	2024	\N	\N	1	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	11
Math	SED	1	2023	2024	1	1	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	8
Science-BSED	SED	1	2023	2024	3	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	12
SocialStud-BSED	SED	1	2023	2024	5	2	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	8
TOTAL	SED	1	2023	2024	44	64	55	66	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	229
SHS-ABM	SHS	1	2023	2024	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	191	263	454
SHS-GenAcad	SHS	1	2023	2024	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	68	32	100
SHS-HUMSS	SHS	1	2023	2024	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	204	176	380
SHS-STEM	SHS	1	2023	2024	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	609	779	1388
SHS-TVL-HE	SHS	1	2023	2024	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	82	64	146
SHS-TVL-ICT	SHS	1	2023	2024	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	113	102	215
TOTAL	SHS	1	2023	2024	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1267	1416	2683
BSCulinary	SHTM	1	2023	2024	1	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2
BSHM-Accomm	SHTM	1	2023	2024	12	6	22	19	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	59
BSHM-Culinary	SHTM	1	2023	2024	62	75	46	51	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	234
BSHM-RestFood	SHTM	1	2023	2024	33	27	20	24	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	104
BSHRM	SHTM	1	2023	2024	1	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2
BSInterGastro	SHTM	1	2023	2024	24	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	27
BSTM-DestMgmt	SHTM	1	2023	2024	4	7	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	14
BSTM-Events	SHTM	1	2023	2024	1	4	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7
BSTM-Travel	SHTM	1	2023	2024	150	114	122	119	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	505
BSTourism	SHTM	1	2023	2024	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
TOTAL	SHTM	1	2023	2024	288	237	216	214	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	955
BS MedTech	SNAMS	1	2023	2024	87	65	26	13	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	191
BSNursing	SNAMS	1	2023	2024	83	177	129	76	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	465
BSRadTech	SNAMS	1	2023	2024	27	25	23	13	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	88
TOTAL	SNAMS	1	2023	2024	197	267	178	102	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	744
BSCompsci	SOC	1	2023	2024	166	97	61	58	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	382
BSCyberplusPSM	SOC	1	2023	2024	10	7	11	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	28
BSCybersecurity	SOC	1	2023	2024	15	22	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	45
BSEMC-DA	SOC	1	2023	2024	91	71	70	44	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	276
BSITAreaNetAdmi	SOC	1	2023	2024	45	31	25	32	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	133
BSITAreaWebDev	SOC	1	2023	2024	145	95	93	66	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	399
TOTAL	SOC	1	2023	2024	472	323	268	200	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1263
GRAND TOTAL	HAU	1	2023	2024	2899	2842	2532	2515	187	\N	\N	\N	68	77	91	399	429	415	542	1267	1416	15679
BForensicSci	CCJEF	2	2023	2024	58	32	18	26	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	134
Criminology	CCJEF	2	2023	2024	39	73	45	55	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	212
TOTAL	CCJEF	2	2023	2024	97	105	63	81	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	346
ABPsychology	SAS	2	2023	2024	25	34	19	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	78
BA Comm	SAS	2	2023	2024	70	46	54	67	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	237
BSPsychology	SAS	2	2023	2024	92	90	100	129	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	411
TOTAL	SAS	2	2023	2024	187	170	173	196	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	726
Accountancy	SBA	2	2023	2024	326	344	356	111	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1137
BSBA-FinMgmt	SBA	2	2023	2024	21	35	21	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	77
BSBA-HRMgmt	SBA	2	2023	2024	11	7	11	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	31
BSBA-MktgMgmt	SBA	2	2023	2024	77	56	61	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	200
BSBALegal	SBA	2	2023	2024	30	31	25	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	91
BSIntAuditing	SBA	2	2023	2024	2	1	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	4
BSBAMgmtAcctg	SBA	2	2023	2024	56	26	18	19	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	119
BusMgt	SBA	2	2023	2024	116	145	141	23	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	425
BussMgmt-HRM	SBA	2	2023	2024	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
TOTAL	SBA	2	2023	2024	639	646	633	167	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2085
Architecture	SEA	2	2023	2024	126	177	157	126	196	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	782
BSAeronautical	SEA	2	2023	2024	244	272	279	367	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1162
BSCE-CEM	SEA	2	2023	2024	\N	\N	\N	116	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	116
BSCE-SE	SEA	2	2023	2024	\N	\N	\N	67	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	67
BSCE-TE	SEA	2	2023	2024	\N	\N	\N	52	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	52
CE	SEA	2	2023	2024	166	250	273	16	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	705
Comp. Eng'g.	SEA	2	2023	2024	92	72	66	36	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	266
EE	SEA	2	2023	2024	21	31	23	43	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	118
ELECENG	SEA	2	2023	2024	19	37	28	53	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	137
IE	SEA	2	2023	2024	64	38	10	34	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	146
ME	SEA	2	2023	2024	72	83	79	75	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	309
TOTAL	SEA	2	2023	2024	804	960	915	985	196	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	3860
BEEd	SED	2	2023	2024	10	24	27	13	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	74
BPEd	SED	2	2023	2024	2	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	3
BSED-RelValEd	SED	2	2023	2024	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	9
BSNEd	SED	2	2023	2024	1	19	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	21
English-BSED	SED	2	2023	2024	15	18	13	31	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	77
Fil-BSED	SED	2	2023	2024	\N	\N	\N	11	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	11
Math	SED	2	2023	2024	1	1	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	8
Science-BSED	SED	2	2023	2024	2	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	11
SocialStud-BSED	SED	2	2023	2024	5	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	6
TOTAL	SED	2	2023	2024	36	62	55	67	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	220
SHS-ABM	SHS	2	2023	2024	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	185	263	448
SHS-GenAcad	SHS	2	2023	2024	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	67	30	97
SHS-HUMSS	SHS	2	2023	2024	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	201	171	372
SHS-STEM	SHS	2	2023	2024	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	600	777	1377
SHS-TVL-HE	SHS	2	2023	2024	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	76	63	139
SHS-TVL-ICT	SHS	2	2023	2024	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	110	101	211
TOTAL	SHS	2	2023	2024	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1239	1405	2644
BSCulinary	SHTM	2	2023	2024	1	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2
BSHM-Accomm	SHTM	2	2023	2024	10	4	20	18	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	52
BSHM-Culinary	SHTM	2	2023	2024	58	76	50	50	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	234
BSHM-RestFood	SHTM	2	2023	2024	28	27	20	22	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	97
BSHRM	SHTM	2	2023	2024	\N	1	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2
BSInterGastro	SHTM	2	2023	2024	22	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	22
BSTM-DestMgmt	SHTM	2	2023	2024	4	4	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	10
BSTM-Events	SHTM	2	2023	2024	\N	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	3
BSTM-Travel	SHTM	2	2023	2024	143	107	123	115	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	488
BSTourism	SHTM	2	2023	2024	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
TOTAL	SHTM	2	2023	2024	266	221	218	206	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	911
BS MedTech	SNAMS	2	2023	2024	74	47	23	12	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	156
BSNursing	SNAMS	2	2023	2024	75	169	122	77	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	443
BSRadTech	SNAMS	2	2023	2024	25	24	22	13	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	84
TOTAL	SNAMS	2	2023	2024	174	240	167	102	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	683
BSCompsci	SOC	2	2023	2024	158	94	58	51	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	361
BSCyberplusPSM	SOC	2	2023	2024	11	6	11	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	28
BSCybersecurity	SOC	2	2023	2024	18	21	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	47
BSEMC-DA	SOC	2	2023	2024	93	69	63	48	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	273
BSITAreaNetAdmi	SOC	2	2023	2024	26	31	24	28	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	109
BSITAreaWebDev	SOC	2	2023	2024	152	97	89	69	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	407
TOTAL	SOC	2	2023	2024	458	318	253	196	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1225
GRAND TOTAL	HAU	2	2023	2024	2661	2722	2477	2000	196	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1239	1405	12700
BForensicSci	CCJEF	1	2024	2025	41	52	34	19	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	146
BS Criminology	CCJEF	1	2024	2025	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
Criminology	CCJEF	1	2024	2025	46	38	70	43	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	198
TOTAL	CCJEF	1	2024	2025	87	91	104	62	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	345
GS	GS	1	2024	2025	\N	\N	\N	\N	\N	\N	\N	\N	\N	66	74	\N	\N	\N	\N	\N	\N	140
TOTAL	GS	1	2024	2025	\N	\N	\N	\N	\N	\N	\N	\N	\N	66	74	\N	\N	\N	\N	\N	\N	140
JHS	JHS	1	2024	2025	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	375	396	440	427	\N	\N	1638
TOTAL	JHS	1	2024	2025	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	375	396	440	427	\N	\N	1638
MSPsychology	MA	1	2024	2025	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	3
TOTAL	MA	1	2024	2025	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	3
ABPsychology	SAS	1	2024	2025	42	29	30	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	101
BA Comm	SAS	1	2024	2025	53	77	39	52	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	221
BSPsychology	SAS	1	2024	2025	112	82	80	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	279
TOTAL	SAS	1	2024	2025	207	188	149	57	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	601
Accountancy	SBA	1	2024	2025	353	297	341	364	103	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1458
BSAviationMgmt	SBA	1	2024	2025	27	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	28
BSBA-FinMgmt	SBA	1	2024	2025	20	24	35	20	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	99
BSBA-HRMgmt	SBA	1	2024	2025	4	12	8	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	33
BSBA-MktgMgmt	SBA	1	2024	2025	41	77	58	56	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	232
BSBALegal	SBA	1	2024	2025	19	30	25	27	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	101
BSIntAuditing	SBA	1	2024	2025	\N	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	3
BSBAMgmtAcctg	SBA	1	2024	2025	5	49	29	18	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	101
BusMgt	SBA	1	2024	2025	100	111	141	132	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	484
BussMgmt-HRM	SBA	1	2024	2025	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
TOTAL	SBA	1	2024	2025	569	604	638	626	103	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2540
Architecture	SEA	1	2024	2025	153	135	175	149	143	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	755
BSAeronautical	SEA	1	2024	2025	306	222	267	343	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1138
BSCE-CEM	SEA	1	2024	2025	\N	\N	\N	150	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	150
BSCE-SE	SEA	1	2024	2025	\N	\N	\N	83	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	83
BSCE-TE	SEA	1	2024	2025	\N	\N	\N	55	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	55
CE	SEA	1	2024	2025	222	168	245	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	642
Comp. Eng'g.	SEA	1	2024	2025	65	87	81	52	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	285
EE	SEA	1	2024	2025	28	24	29	23	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	104
ELECENG	SEA	1	2024	2025	30	23	33	28	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	114
IE	SEA	1	2024	2025	28	67	34	18	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	147
ME	SEA	1	2024	2025	78	84	89	59	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	310
TOTAL	SEA	1	2024	2025	910	810	953	967	143	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	3783
BEEd	SED	1	2024	2025	9	17	21	24	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	71
BPEd	SED	1	2024	2025	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	8
BSED-RelValEd	SED	1	2024	2025	1	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	10
BSNEd	SED	1	2024	2025	8	1	18	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	27
English-BSED	SED	1	2024	2025	17	14	16	14	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	61
Math	SED	1	2024	2025	3	\N	1	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	10
Science-BSED	SED	1	2024	2025	6	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	8
SocialStud-BSED	SED	1	2024	2025	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	5
TOTAL	SED	1	2024	2025	57	32	56	55	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	200
SHS-ABM	SHS	1	2024	2025	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	192	178	370
SHS-GenAcad	SHS	1	2024	2025	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	66	66
SHS-HUMSS	SHS	1	2024	2025	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	148	190	338
SHS-STEM	SHS	1	2024	2025	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	648	590	1238
SHS-TVL-HE	SHS	1	2024	2025	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	42	71	113
SHS-TVL-ICT	SHS	1	2024	2025	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	73	107	180
TOTAL	SHS	1	2024	2025	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1103	1202	2305
BSCulinary	SHTM	1	2024	2025	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
BSHM-Accomm	SHTM	1	2024	2025	16	11	5	20	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	52
BSHM-Culinary	SHTM	1	2024	2025	61	56	75	52	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	244
BSHM-RestFood	SHTM	1	2024	2025	24	27	24	19	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	94
BSInterGastro	SHTM	1	2024	2025	19	20	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	39
BSTM-DestMgmt	SHTM	1	2024	2025	\N	4	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	5
BSTM-Events	SHTM	1	2024	2025	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
BSTM-Travel	SHTM	1	2024	2025	140	141	102	125	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	508
BSTourism	SHTM	1	2024	2025	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1
TOTAL	SHTM	1	2024	2025	261	259	206	219	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	945
BS MedTech	SNAMS	1	2024	2025	102	61	44	17	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	224
BSNursing	SNAMS	1	2024	2025	100	85	133	121	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	439
BSRadTech	SNAMS	1	2024	2025	100	30	23	19	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	172
TOTAL	SNAMS	1	2024	2025	302	176	200	157	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	835
BSCompsci	SOC	1	2024	2025	101	144	90	59	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	394
BSCyberplusPSM	SOC	1	2024	2025	17	10	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	31
BSCybersecurity	SOC	1	2024	2025	45	29	21	17	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	112
BSEMC-DA	SOC	1	2024	2025	104	96	67	64	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	331
BSITAreaNetAdmi	SOC	1	2024	2025	35	19	27	25	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	106
BSITAreaWebDev	SOC	1	2024	2025	160	145	85	97	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	487
TOTAL	SOC	1	2024	2025	462	443	294	262	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1461
GRAND TOTAL	HAU	1	2024	2025	2858	2603	2600	2405	246	0	0	0	0	66	74	375	396	441	427	1103	1202	14796
\.


--
-- Data for Name: hfce; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hfce ("Start_Year", "Quarter", "HFCE_Education", "HFCE") FROM stdin;
2011	1	82928	1689009
2011	2	86092	1816501
2011	3	91887	1762602
2011	4	102591	2049375
2012	1	88741	1878447
2012	2	92613	1963276
2012	3	98618	1936819
2012	4	108111	2246467
2013	1	98186	2031658
2013	2	99890	2111436
2013	3	109476	2098485
2013	4	117794	2436145
2014	1	106809	2204907
2014	2	108724	2291325
2014	3	125121	2280899
2014	4	132863	2635906
2015	1	120522	2372797
2015	2	118210	2468974
2015	3	133675	2436184
2015	4	139137	2827778
2016	1	129516	2547013
2016	2	132224	2680857
2016	3	146810	2664733
2016	4	151824	3086483
2017	1	144263	2782053
2017	2	144109	2923649
2017	3	166270	2889159
2017	4	163246	3356002
2018	1	157093	3050982
2018	2	159229	3240042
2018	3	192427	3227592
2018	4	187784	3731469
2019	1	168251	3340847
2019	2	174038	3499709
2019	3	207064	3462628
2019	4	203208	3985148
2020	1	178600	3422615
2020	2	153991	3042128
2020	3	175029	3210325
2020	4	176161	3801008
2021	1	183227	3397750
2021	2	172830	3395240
2021	3	202279	3583127
2021	4	193235	4232430
2022	1	205496	3853345
2022	2	186716	3878011
2022	3	219409	4131183
2022	4	219841	4862506
2023	1	227676	4418198
2023	2	207379	4326017
2023	3	242002	4534502
2023	4	246553	5329613
2024	1	245341	4780006
2024	2	216127	4701289
\.


--
-- Data for Name: inflation_rate; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inflation_rate ("Start_Year", "Inflation_Rate", "Inflation_Rate_lag_1", "Inflation_Rate_lag_2", "Inflation_Rate_lag_3", "Inflation_Rate_lag_4") FROM stdin;
2012	3.026963911	\N	\N	\N	\N
2013	2.582687661	3.026963911	\N	\N	\N
2014	3.597823439	2.582687661	3.026963911	\N	\N
2015	0.674192537	3.597823439	2.582687661	3.026963911	\N
2016	1.253698801	0.674192537	3.597823439	2.582687661	3.026963911
2017	2.853187726	1.253698801	0.674192537	3.597823439	2.582687661
2018	5.309346616	2.853187726	1.253698801	0.674192537	3.597823439
2019	2.392065344	5.309346616	2.853187726	1.253698801	0.674192537
2020	2.393162393	2.392065344	5.309346616	2.853187726	1.253698801
2021	3.927180221	2.393162393	2.392065344	5.309346616	2.853187726
2022	5.821158112	3.927180221	2.393162393	2.392065344	5.309346616
2023	5.978025155	5.821158112	3.927180221	2.393162393	2.392065344
\.


--
-- PostgreSQL database dump complete
--

