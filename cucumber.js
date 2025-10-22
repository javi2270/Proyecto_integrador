// sgmr/cucumber.js

module.exports = {
  default: {
    // Le decimos a Cucumber dónde encontrar los archivos de especificaciones
    paths: ['features/**/*.feature'],

    // Le decimos dónde encontrar el código que implementa esos pasos
    require: ['features/step_definitions/**/*.js']
  }
};