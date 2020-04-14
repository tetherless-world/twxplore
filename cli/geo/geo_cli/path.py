import os.path
from pathlib import Path

ROOT_DIR_PATH = Path(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..")))
DATA_DIR_PATH = ROOT_DIR_PATH / "data" / "geo"
