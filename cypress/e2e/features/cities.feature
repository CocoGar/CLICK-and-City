@auto

Feature: Búsqueda de ciudades en la página de inicio

  Background:
    Given el usuario está en la página de inicio


  Scenario: Buscar "<ciudad>" navega a la página de ciudad
    When el usuario escribe "<ciudad>" en el buscador
    And hace clic en el botón "Buscar"
    Then es redirigido a la página de ciudad de "<ciudad>"

    Examples:
      | ciudad |
      | Madrid |
      | Tokyo  |
      | London |

  Scenario: Buscar con el campo vacío muestra mensaje de error
    When el usuario hace clic en el botón "Buscar" sin escribir nada
    Then ve el mensaje "Por favor introduce un nombre de ciudad válido (solo letras, mínimo 2 caracteres)."

  Scenario: Buscar con un solo carácter muestra mensaje de error
    When el usuario escribe "M" en el buscador
    And hace clic en el botón "Buscar"
    Then ve el mensaje "Por favor introduce un nombre de ciudad válido (solo letras, mínimo 2 caracteres)."

  Scenario: Buscar con números muestra mensaje de error
    When el usuario escribe "12345" en el buscador
    And hace clic en el botón "Buscar"
    Then ve el mensaje "Por favor introduce un nombre de ciudad válido (solo letras, mínimo 2 caracteres)."

  Scenario: Buscar con símbolos muestra mensaje de error
    When el usuario escribe "@#$%" en el buscador
    And hace clic en el botón "Buscar"
    Then ve el mensaje "Por favor introduce un nombre de ciudad válido (solo letras, mínimo 2 caracteres)."

  Scenario: Buscar una ciudad inexistente muestra mensaje de ciudad no encontrada
    When el usuario escribe "Motocicleta" en el buscador
    And hace clic en el botón "Buscar"
    Then ve el mensaje "Ciudad no encontrada. Por favor verifica el nombre e inténtalo de nuevo."

  Scenario: El mensaje de error desaparece al volver a escribir
    When el usuario escribe "12345" en el buscador
    And hace clic en el botón "Buscar"
    Then ve el mensaje "Por favor introduce un nombre de ciudad válido (solo letras, mínimo 2 caracteres)."
    When el usuario empieza a escribir en el buscador
    Then el mensaje de error desaparece

  Scenario: Aparecen sugerencias al escribir mínimo 2 caracteres
    When el usuario escribe "Mad" en el buscador
    Then en el desplegable aparecen sugerencias de ciudades

  Scenario: No aparecen sugerencias con menos de 2 caracteres
    When el usuario escribe "M" en el buscador
    Then no aparecen sugerencias en el desplegable

  Scenario: Hacer clic en una sugerencia navega a la ciudad correcta
    When el usuario escribe "Mad" en el buscador
    And aparecen sugerencias de ciudades en el desplegable
    And hace clic en la primera sugerencia
    Then es redirigido a la página de ciudad de esa sugerencia