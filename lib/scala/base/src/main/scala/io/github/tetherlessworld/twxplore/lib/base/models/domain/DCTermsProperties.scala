package io.github.tetherlessworld.twxplore.lib.base.models.domain

import org.apache.jena.rdf.model.ResourceFactory
import org.apache.jena.vocabulary.DCTerms

trait DCTermsProperties extends PropertyGetters with PropertySetters {
  final def identifier = getPropertyObjectString(DCTerms.identifier)


  final def identifier_=(value: String): Unit =
    setProperty(DCTerms.identifier, List(ResourceFactory.createPlainLiteral(value)))

}
