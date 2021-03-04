import Paper from "paper";

const abc = "abcdefghijklmnopqrstuvwxyz";

const appNames = [
  "Audit Event Form",
  "Centralized Time Tracking",
  "Digital Andon Monitoring",
  "Digital Andon System",
  "Digital Logbook",
  "Digital Logbook with Work Instructions"
];

const ArtGenerator = {
  getAppName(i) {
    return appNames[i].toLowerCase().split(" ");
  },

  getDegreeOf(letter) {
    return 360 / 26 * (1 + abc.indexOf(letter));
  },

  r: 100,

  drawAsLine(word) {
    const path = new Paper.Path();

    [...word].forEach(letter => {
      const theta = this.getDegreeOf(letter);
      const x = this.r * Math.sin(theta) + Paper.view.center.x;
      const y = this.r * Math.cos(theta) + Paper.view.center.y;
      path.add(new Paper.Point(x, y));
    });

    return path;
  },

  generateArt() {
    const circle = new Paper.Path.Circle(Paper.view.center, this.r);

    const wordPaths = this.getAppName(3).map(word => this.drawAsLine(word));

    const group = new Paper.Group([circle, ...wordPaths]);
    group.strokeColor = "black";

    window.addEventListener("resize", () => {
      group.position = Paper.view.center;
    });
  },

  init () {
    const canvas = document.getElementById('canvas');

    Paper.setup(canvas);

    this.generateArt();

    Paper.view.draw();
  }
};

document.addEventListener("DOMContentLoaded", ArtGenerator.init());
