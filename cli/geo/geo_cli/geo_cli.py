from geo_cli.etl.file_loader import FileLoader
from geo_cli.etl.tiger_line.tiger_line_transformer import TigerLineTransformer
from geo_cli.etl.uls.en_uls_transformer import EnUlsTransformer
from geo_cli.path import DATA_DIR_PATH


def main():
    EnUlsTransformer("l_amat").transform()
    return
    with FileLoader(DATA_DIR_PATH / "loaded" / "tiger_line" / "features.ttl") as loader:
        loader.load(TigerLineTransformer().transform())

if __name__ == '__main__':
    main()
