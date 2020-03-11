from geo_cli.geocoder import Geocoder


def test_geocode():
    address = "1 COLUMBUS PLACE APT N9G NEW YORK NY 10019"
    expected = "POINT (-73.9854256, 40.7693739)"
    actual = Geocoder().geocode(address)
    assert actual == expected
    actual = Geocoder().geocode(address)  # Use cache
    assert actual == expected
