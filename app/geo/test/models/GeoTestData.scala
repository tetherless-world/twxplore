package models

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.twxplore.lib.geo.models.domain.Geometry
import models.domain.{Feature, FeatureType}

object GeoTestData {

    // WKT contained by the featureGeometry
    val containedWkt = "POLYGON((22.43151320189357 30.24760210803391,24.80456007689357 30.24760210803391,24.80456007689357 28.408717322168872,22.43151320189357 28.408717322168872,22.43151320189357 30.24760210803391))"
    val containedGeometry = Geometry(label = None, uri = Uri.parse("http://example.com/containedGeometry"), wkt = containedWkt)
    val containedFeature = Feature(geometry = containedGeometry, label = Some("Contained feature"), `type` = Some(FeatureType.MilitaryInstallation), uri = Uri.parse("http://example.com/containedFeature"))

    // WKT containing the featureGeometry
    val containingWkt = "POLYGON((4.345703124999991 41.66202547963382,44.77539062499999 41.66202547963382,44.77539062499999 5.994966023841324,4.345703124999991 5.994966023841324,4.345703124999991 41.66202547963382))"
    val containingGeometry = Geometry(label = None, uri = Uri.parse("http://example.com/containingGeometry"), wkt = containingWkt)
    val containingFeature = Feature(geometry = containingGeometry, label = Some("Containing feature"), `type` = Some(FeatureType.State), uri = Uri.parse("http://example.com/containingFeature"))

    val featureGeometry = Geometry(label = Some("Test feature geometry"), wkt = "POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10))", uri = Uri.parse("http://example.com/geometry"))
    val feature = Feature(frequency = Some(1.0), geometry = featureGeometry, label = Some("Test feature"), `type` = Some(FeatureType.MetropolitanDivision), uri = Uri.parse("http://example.com/feature"))

}
