package stores

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.twxplore.lib.geo.models.domain.{Borough, Nta, Tree}
import io.github.tetherlessworld.twxplore.lib.tree.TestData

object TestStore extends Store {
  private def ntaByUri(uri: Uri): Nta = {
    val id = uri.toString.substring(uri.toString.lastIndexOf(":")+ 1)
    TestData.ntaMap(id)
  }

  override def getTrees(limit: Int, offset: Int): List[Tree] = if (offset == 0) TestData.treeList else List()

  override def getNtasByBorough(borough: Borough): List[Nta] = if (borough != null && borough == TestData.boroughMap(1)) TestData.boroughMap(1).ntaList.map(nta => ntaByUri(nta)) else List()
}
