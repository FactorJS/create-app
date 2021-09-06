/* eslint-disable no-console */
/* eslint-disable unicorn/no-process-exit */
const path = require("path");

const superb = require("superb");

const consola = require("consola");

let answers = {};

const config = {
  /**
   * Answers to these questions get added to the template as variables
   * If first answer is "UNIT-TEST" then mocked answers are used.
   */
  prompts: [
    {
      name: "name",
      message: "Project name?",
      default: `${superb.random()} project`,
    },
  ],
  isUnitTest(answers) {
    return answers.name == "UNIT-TEST" ? true : false;
  },

  /**
   * Info returned here gets added as variables in the template generation
   */
  templateData() {
    const data = {};
    answers = this.answers;

    data.urlName = config.slugify(answers.name || "no-name");
    data.randomString = Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, "")
      .slice(0, 30);

    return data;
  },
  slugify(text) {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/[^\w-]+/g, "") // Remove all non-word chars
      .replace(/--+/g, "-") // Replace multiple - with single -
      .replace(/^-+/, "") // Trim - from start of text
      .replace(/-+$/, ""); // Trim - from end of text
  },
  /**
   * Actions are files that get moved and translated through EJS system
   */
  actions() {
    const actions = [
      {
        type: "add",
        files: "**",
        templateDir: "template/factor",
        filters: {},
      },
      {
        type: "add",
        files: "*",
        filters: {},
      },
      {
        type: "move",
        patterns: {
          _gitignore: ".gitignore",
          "_package.json": "package.json",
          _env: ".env",
        },
      },
    ];

    return actions;
  },
  async diagnostic({ id }) {},
  async completed() {
    this.gitInit();

    try {
      await this.npmInstall();
    } catch (error) {
      consola.error(error);
    }

    this.showProjectTips();

    const isNewFolder = this.outDir !== process.cwd();
    const cd = () => {
      if (isNewFolder) {
        console.log(
          `\t${this.chalk.bold.green("cd")} ${this.chalk.bold(
            path.relative(process.cwd(), this.outDir)
          )}`
        );
      }
    };

    const runner = this.npmClient == "yarn" ? "npx" : "npm";
    console.log();
    console.log();
    console.log(this.chalk.bold(`  Ready! Start Development:\n`));
    cd();
    console.log();
    console.log(
      `\t${
        this.chalk.magenta.bold(`${runner} `) + this.chalk.bold("factor dev")
      }\n`
    );
    console.log();
    console.log(
      `   ${this.chalk.bold(`Docs:`)} ${this.chalk.dim(
        "https://www.factor.so/docs"
      )}`
    );
    console.log(
      `   ${this.chalk.bold(`Slack:`)} ${this.chalk.dim(
        "https://join.slack.com/t/factorjs/shared_invite/zt-biopdz00-pnEJOPDPcm8DSTGLccH_Og"
      )}`
    );
    console.log();
    console.log();
  },
};

module.exports = config;
