// sgmr/cucumber.js

module.exports = {
  default: {
    // Le digo a Cucumber dónde encontrar los archivos de especificaciones
    paths: ['features/**/*.feature'],

    // Le digo dónde encontrar el código que implementa esos pasos
    require: ['features/step_definitions/**/*.js']
  }
};

