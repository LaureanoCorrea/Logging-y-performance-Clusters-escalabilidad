import { Command } from "commander";

const program = new Command();

program
  .option("--mode <mode>", "Modo de Uso del Servidor", "production")
  .parse();


export default program;
