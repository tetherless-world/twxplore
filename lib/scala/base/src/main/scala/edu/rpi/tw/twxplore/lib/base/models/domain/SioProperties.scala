package edu.rpi.tw.twxplore.lib.base.models.domain

import edu.rpi.tw.twxplore.lib.base.models.domain.vocabulary.SIO
import org.apache.jena.rdf.model.ResourceFactory

trait SioProperties extends PropertyGetters with PropertySetters {

  /**
   * Get all sio:hasattribute's of a resource.
   */
  //Getters
  final def associatedWithP = getPropertyObjectStrings(SIO.isAssociatedWith)

  final def associatedWith = associatedWithP.headOption

  final def spatioTempRelatedTo = getPropertyObjectString(SIO.isSpatioTempRelatedTo)

  final def locationIn(): Option[String] = getPropertyObjectString(SIO.isLocationIn)

  final def locationOf(): Option[String] = getPropertyObjectString(SIO.isLocationOf)

  final  def hasValue(): Option[String] = getPropertyObjectString(SIO.hasValue)

  final def hasUnit(): Option[String] = getPropertyObjectString(SIO.hasUnit)


  //setters
  final def associatedWith_=(value: String) =
    this.associatedWithP = List(value)

  final def associatedWithP_=(values: List[String]) = setProperty(SIO.isAssociatedWith, values.map(value => ResourceFactory.createPlainLiteral(value)))

  final def spatioTempRelatedTo_= (value: String): Unit =
    setProperty(SIO.isSpatioTempRelatedTo, List(ResourceFactory.createPlainLiteral(value)))

  final def locationIn_= (value: String): Unit =
    setProperty(SIO.isLocationIn, List(ResourceFactory.createPlainLiteral(value)))

  final def locationOf_= (value: String): Unit =
    setProperty(SIO.isLocationOf, List(ResourceFactory.createPlainLiteral(value)))

  final def hasValue_= (value: String): Unit =
    setProperty(SIO.hasValue, List(ResourceFactory.createPlainLiteral(value)))

  final def hasUnit_= (value: String): Unit =
    setProperty(SIO.hasUnit, List(ResourceFactory.createPlainLiteral(value)))

}
