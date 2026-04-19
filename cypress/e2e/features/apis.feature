@auto

Feature: Verificación de datos de las APIs en la página de ciudad

  Scenario: La página de <ciudad> muestra todos los datos correctamente según las APIs
    Given el usuario ha buscado la ciudad "<ciudad>"
    Then el clima mostrado en la tarjeta corresponde con la respuesta de la API
    And la imagen del carrusel corresponde con la URL devuelta por Unsplash
    And el primer restaurante mostrado corresponde con la respuesta de Foursquare
    And el primer lugar de ocio mostrado corresponde con la respuesta de Foursquare
    And el primer parque mostrado corresponde con la respuesta de Foursquare
    And la primera tienda mostrada corresponde con la respuesta de Foursquare

    Examples:
      | ciudad     |
      | Barcelona  |
      | Valladolid |
      | Granada    |