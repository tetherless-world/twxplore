from io import TextIOWrapper
from typing import Generator
from zipfile import ZipFile

from geo_cli.model.uls_entity import UlsEntity
from geo_cli.path import DATA_DIR_PATH


class UlsEntitiesTransformer:
    def __init__(self, zip_file_base_name: str):
        self.__zip_file_base_name = zip_file_base_name

    def transform(self) -> Generator[UlsEntity, None, None]:
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
                    if record_type != "EN":
                        continue
                    unique_system_identifier = columns[1]
                    call_sign = columns[4].strip()
                    if not call_sign:
                        continue
                    name = columns[7].strip()
                    if not name:
                        continue
                    street_address = columns[15].strip()
                    if not street_address:
                        continue
                    city = columns[16].strip()
                    if not city:
                        continue
                    state = columns[17].upper().strip()
                    if not state:
                        continue
                    # elif state != "NY":
                    #     continue
                    zip_code = columns[18].strip()
                    if not zip_code:
                        continue
                    entity = \
                        UlsEntity(
                            call_sign=call_sign,
                            city=city,
                            name=name,
                            state=state,
                            street_address=street_address,
                            unique_system_identifier=unique_system_identifier,
                            zip_code=zip_code
                        )
                    # existing_entity = self.__by_call_sign.get(entity.call_sign)
                    # if existing_entity is not None and existing_entity.name != entity.name:
                    #     print("Duplicate entity: original=", existing_entity, "duplicate=", entity)
                    yield entity
