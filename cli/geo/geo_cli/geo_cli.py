from geo_cli.etl.file_loader import FileLoader
from geo_cli.etl.tiger_line.tiger_line_transformer import TigerLineTransformer


def main():
    with FileLoader("tiger_line") as loader:
        loader.load(TigerLineTransformer().transform())
