package io.github.tetherlessworld.twxplore.lib.base.models.domain.vocabulary

import org.apache.jena.geosparql.implementation.vocabulary.GeoSPARQL_URI.{GEO_URI, SF_URI}
import org.apache.jena.shared.PrefixMapping

object Vocabularies {
  def setNsPrefixes(prefixMapping: PrefixMapping): Unit = {
    edu.rpi.tw.twks.vocabulary.Vocabularies.setNsPrefixes(prefixMapping)
    prefixMapping.setNsPrefix("geo", GEO_URI)
    prefixMapping.setNsPrefix("sf", SF_URI)
  }
}
