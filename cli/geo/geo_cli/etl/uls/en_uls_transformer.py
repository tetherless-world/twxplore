from io import TextIOWrapper
from typing import Generator
from zipfile import ZipFile

from geo_cli.etl.uls._uls_transformer import _UlsTransformer
from geo_cli.model.feature import Feature
from geo_cli.path import DATA_DIR_PATH


class EnUlsTransformer(_UlsTransformer):
    def __init__(self, zip_file_base_name: str):
        self.__zip_file_base_name = zip_file_base_name

    def transform(self) -> Generator[Feature, None, None]:
        with ZipFile(DATA_DIR_PATH / "extracted" / "uls" / (self.__zip_file_base_name + ".zip")) as zip_file:
            with zip_file.open("EN.dat") as en_file:
                for line in TextIOWrapper(en_file, "utf-8"):
                    columns = line.split("|")
# Entity
# Position Data Element Definition
# [EN]
# 1 Record Type [EN] char(2)
# 2 Unique System Identifier numeric(9,0)
# 3 ULS File Number char(14)
# 4 EBF Number varchar(30)
# 5 Call Sign char(10)
# 6 Entity Type char(2)
# 7 Licensee ID char(9)
# 8 Entity Name varchar(200)
# 9 First Name varchar(20)
# 10 MI char(1)
# 11 Last Name varchar(20)
# 12 Suffix char(3)
# 13 Phone char(10)
# 14 Fax char(10)
# 15 Email varchar(50)
# 16 Street Address varchar(60)
# 17 City varchar(20)
# 18 State char(2)
# 19 Zip Code char(9)
# 20 PO Box varchar(20)
# 21 Attention Line varchar(35)
# 22 SGIN char(3)
# 23 FCC Registration Number (FRN) char(10)
# 24 Applicant Type Code char(1)
# 25 Applicant Type Code Other char(40)
# 26 Status Code char(1)
# 27 Status Date mm/dd/yyyy
                    record_type = columns[0]
                    # unique_system_identifier = columns[1]
                    callsign = columns[4]
                    name = columns[8]
                    street_address = columns[15]
                    city = columns[16]
                    state = columns[17].upper()
                    zip_code = columns[18]
                    if state != "NY":
                        continue
                    if not city or not street_address or not state or not zip_code:
                        continue
                    print(record_type, callsign, name, street_address, city, state, zip_code)
