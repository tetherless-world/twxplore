package stores

import edu.rpi.tw.twks.client.direct.DirectTwksClient
import edu.rpi.tw.twks.configuration.TwksGeoSPARQLConfiguration
import edu.rpi.tw.twks.mem.{MemTwks, MemTwksConfiguration}
import edu.rpi.tw.twks.nanopub.Nanopublication
import io.github.tetherlessworld.scena.Rdf
import io.github.tetherlessworld.twxplore.lib.geo.GeoTestData

object TestTwks {
  val twks = new MemTwks(MemTwksConfiguration.builder().setGeoSparqlConfiguration(TwksGeoSPARQLConfiguration.builder().setEnable(true).build()).build())
  val twksClient = new DirectTwksClient(twks)

  private val nanopublicationBuilder = Nanopublication.builder()
  Rdf.write(nanopublicationBuilder.getAssertionBuilder.getModel, GeoTestData.feature)
  Rdf.write(nanopublicationBuilder.getAssertionBuilder.getModel, GeoTestData.geometry)
  twksClient.putNanopublication(nanopublicationBuilder.build())
}
