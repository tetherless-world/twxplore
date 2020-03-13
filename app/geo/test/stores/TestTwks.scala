package stores

import edu.rpi.tw.twks.client.direct.DirectTwksClient
import edu.rpi.tw.twks.configuration.TwksGeoSPARQLConfiguration
import edu.rpi.tw.twks.mem.{MemTwks, MemTwksConfiguration}
import edu.rpi.tw.twks.nanopub.Nanopublication
import io.github.tetherlessworld.scena.Rdf

object TestTwks {
  val twks = new MemTwks(MemTwksConfiguration.builder().setGeoSparqlConfiguration(TwksGeoSPARQLConfiguration.builder().setEnable(true).build()).build())
  val twksClient = new DirectTwksClient(twks)

  private val nanopublicationBuilder = Nanopublication.builder()
  Rdf.write(nanopublicationBuilder.getAssertionBuilder.getModel, GeoTestData.containedFeature)
  Rdf.write(nanopublicationBuilder.getAssertionBuilder.getModel, GeoTestData.containedGeometry)
  Rdf.write(nanopublicationBuilder.getAssertionBuilder.getModel, GeoTestData.containingFeature)
  Rdf.write(nanopublicationBuilder.getAssertionBuilder.getModel, GeoTestData.containingGeometry)
  Rdf.write(nanopublicationBuilder.getAssertionBuilder.getModel, GeoTestData.feature)
  Rdf.write(nanopublicationBuilder.getAssertionBuilder.getModel, GeoTestData.featureGeometry)
  twksClient.putNanopublication(nanopublicationBuilder.build())
}
