from io import StringIO

# Copied from https://www.nrcs.usda.gov/wps/portal/nrcs/detail/?cid=nrcs143_013696
__STATE_FIPS_CODES_STR = """\
Alabama	AL	01
Alaska	AK	02
Arizona	AZ	04
Arkansas	AR	05
California	CA	06
Colorado	CO	08
Connecticut	CT	09
Delaware	DE	10
District of Columbia    DC  11
Florida	FL	12
Georgia	GA	13
Hawaii	HI	15
Idaho	ID	16
Illinois	IL	17
Indiana	IN	18
Iowa	IA	19
Kansas	KS	20
Kentucky	KY	21
Louisiana	LA	22
Maine	ME	23
Maryland	MD	24
Massachusetts	MA	25
Michigan	MI	26
Minnesota	MN	27
Mississippi	MS	28
Missouri	MO	29
Montana	MT	30
Nebraska	NE	31
Nevada	NV	32
New Hampshire	NH	33
New Jersey	NJ	34
New Mexico	NM	35
New York	NY	36
North Carolina	NC	37
North Dakota	ND	38
Ohio	OH	39
Oklahoma	OK	40
Oregon	OR	41
Pennsylvania	PA	42
Rhode Island	RI	44
South Carolina	SC	45
South Dakota	SD	46
Tennessee	TN	47
Texas	TX	48
Utah	UT	49
Vermont	VT	50
Virginia	VA	51
Washington	WA	53
West Virginia	WV	54
Wisconsin	WI	55
Wyoming	WY	56
American Samoa	AS	60
Guam	GU	66
Northern Mariana Islands	MP	69
Puerto Rico	PR	72
Virgin Islands	VI	78
"""

__STATE_FIPS_CODES_PARSED = []
for line in StringIO(__STATE_FIPS_CODES_STR).readlines():
    line = line.strip().rsplit(sep=None, maxsplit=2)
    if not line:
        continue
    assert len(line) == 3, line
    __STATE_FIPS_CODES_PARSED.append((line[0], line[1], int(line[2])))

STATE_FIPS_CODES_BY_NAME = {entry[0]: entry[2] for entry in __STATE_FIPS_CODES_PARSED}
STATE_FIPS_CODES_BY_ABBREVIATION = {entry[1]: entry[2] for entry in __STATE_FIPS_CODES_PARSED}
STATE_NAMES_BY_FIPS_CODE = {entry[2]: entry[0] for entry in __STATE_FIPS_CODES_PARSED}

STATE_NAMES_BY_ABBREVIATION = {entry[1]: entry[0] for entry in __STATE_FIPS_CODES_PARSED}
STATE_ABBREVIATIONS_BY_LOWER_STATE_NAME = {entry[0].lower(): entry[1] for entry in __STATE_FIPS_CODES_PARSED}
STATE_NAMES = {entry[0] for entry in __STATE_FIPS_CODES_PARSED}
