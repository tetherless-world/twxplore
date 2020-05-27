from datetime import date
from typing import Tuple
from urllib.request import urlopen

from tqdm import tqdm

from geo_cli.etl._extractor import _Extractor
from geo_cli.path import DATA_DIR_PATH


class OsnExtractor(_Extractor):
    def __init__(self, days: Tuple[date, ...]):
        _Extractor.__init__(self)
        self.__days = days

    def extract(self):
        data_dir_path = DATA_DIR_PATH / "extracted" / "osn"
        data_dir_path.mkdir(parents=True, exist_ok=True)
        states_csv_tar_file_paths = []
        for day in self.__days:
            for hour in range(24):
                states_csv_tar_file_name = f"states_{day.year:02d}-{day.month:02d}-{day.day:02d}-{hour:02d}.csv.tar"
                states_csv_tar_file_path = data_dir_path / states_csv_tar_file_name
                if states_csv_tar_file_path.exists():
                    states_csv_tar_file_paths.append(states_csv_tar_file_path)
                    self._logger.info("%s exists, skipping download", states_csv_tar_file_path)
                    continue
                continue  # Use the data we have
                states_csv_tar_file_url = f"https://opensky-network.org/datasets/states/{day.year:02d}-{day.month:02d}-{day.day:02d}/{hour:02d}/{states_csv_tar_file_name}"
                try:
                    self._logger.info("downloading %s to %s", states_csv_tar_file_url, states_csv_tar_file_path)
                    f = urlopen(states_csv_tar_file_url)
                    try:
                        with open(states_csv_tar_file_path, "w+b") as states_csv_tar_file:
                            with tqdm(unit="bytes") as progress_bar:
                                byte_count = 0
                                while True:
                                    buffer = f.read(4096)
                                    if not buffer:
                                        break
                                    states_csv_tar_file.write(buffer)
                                    byte_count += len(buffer)
                                    progress_bar.update(byte_count)
                        self._logger.info("downloaded %s (%d bytes) to %s", states_csv_tar_file_url, byte_count, states_csv_tar_file_path)
                        states_csv_tar_file_paths.append(states_csv_tar_file_path)
                    except:
                        states_csv_tar_file_path.unlink()
                        raise
                finally:
                    f.close()
        return {
            "states_csv_tar_file_paths": tuple(states_csv_tar_file_paths)
        }
