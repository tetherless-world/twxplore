package stores

import com.google.inject.ImplementedBy
import io.github.tetherlessworld.twxplore.lib.geo.models.domain._

@ImplementedBy(classOf[TwksStore])
trait Store {
  def getNtasByBorough(borough: Borough): List[Nta]
  def getTrees(limit: Int, offset: Int): List[Tree]
}
