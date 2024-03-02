<script setup>
import { onMounted } from "vue";

onMounted(async () => {
  document.addEventListener("keyup", function (event) {
    const clicked_key = event.key;
    var allKeys = document.querySelectorAll("dt");
    var clickSpace = clicked_key == " ";
    var clickBackSpace = clicked_key == "Backspace";
    allKeys.forEach(function (key) {
      if (clickSpace) {
        allKeys.forEach(function (key) {
          key.style.transition = "ease .3s";
          key.style.backgroundColor = "transparent";
          key.style.border = "1px solid rgb(134, 134, 134)";
          key.style.color = "rgb(134, 134, 134)";
          key.style.boxShadow = "none";
        });

        var spaceButton = document.querySelector("dt#space-button");
        spaceButton.style.transition = "ease .3s";
        spaceButton.style.backgroundColor = "#0ea5e9";
        spaceButton.style.border = "1px solid #0ea5e9";
        spaceButton.style.boxShadow = "rgb(226 181 20 / 8%) 0px 6px 33px";
      } else if (clickBackSpace) {
        allKeys.forEach(function (key) {
          key.style.transition = "ease .3s";
          key.style.backgroundColor = "transparent";
          key.style.border = "1px solid rgb(134, 134, 134)";
          key.style.color = "rgb(134, 134, 134)";
          key.style.boxShadow = "none";
        });
        var spaceButton = document.querySelector("dt#blackspace-button");
        spaceButton.style.transition = "ease .3s";
        spaceButton.style.backgroundColor = "#0ea5e9";
        spaceButton.style.border = "1px solid #0ea5e9";
        spaceButton.style.boxShadow = "rgb(226 181 20 / 8%) 0px 6px 33px";
      } else if (clicked_key == key.innerHTML) {
        key.style.transition = "ease .3s";
        key.style.backgroundColor = "#0ea5e9";
        key.style.border = "1px solid #0ea5e9";
        key.style.color = "black";
        key.style.boxShadow = "rgb(226 181 20 / 8%) 0px 6px 33px";
      } else if (clicked_key != key.innerHTML) {
        key.style.transition = "ease .3s";
        key.style.backgroundColor = "transparent";
        key.style.border = "1px solid rgb(134, 134, 134)";
        key.style.color = "rgb(134, 134, 134)";
        key.style.boxShadow = "none";
      }
    });
  });
});
</script>
<template>
  <ul class="keyboard">
    <li>
      <dt>1</dt>
      <dt>2</dt>
      <dt>3</dt>
      <dt>4</dt>
      <dt>5</dt>
      <dt>6</dt>
      <dt>7</dt>
      <dt>8</dt>
      <dt>9</dt>
      <dt>0</dt>
      <dt>-</dt>
      <dt>=</dt>
      <dt id="blackspace-button">backspace</dt>
    </li>
    <li>
      <dt>q</dt>
      <dt>w</dt>
      <dt>e</dt>
      <dt>r</dt>
      <dt>t</dt>
      <dt>y</dt>
      <dt>u</dt>
      <dt>i</dt>
      <dt>o</dt>
      <dt>p</dt>
      <dt>[</dt>
      <dt>]</dt>
      <dt id="blackslash">\</dt>
    </li>
    <li>
      <dt>a</dt>
      <dt>s</dt>
      <dt>d</dt>
      <dt>f</dt>
      <dt>g</dt>
      <dt>h</dt>
      <dt>j</dt>
      <dt>k</dt>
      <dt>l</dt>
      <dt>;</dt>
      <dt>'</dt>
    </li>
    <li>
      <dt>z</dt>
      <dt>x</dt>
      <dt>c</dt>
      <dt>v</dt>
      <dt>b</dt>
      <dt>n</dt>
      <dt>m</dt>
      <dt>,</dt>
      <dt>.</dt>
      <dt>/</dt>
    </li>
    <dt id="space-button"></dt>
  </ul>
</template>

<style scoped>
ul.keyboard {
  width: 400px;
  width: max-content;
  margin: 0 auto;
}

ul.keyboard li {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 6px;
}

ul.keyboard li dt {
  border: 1px solid rgb(134, 134, 134);
  color: rgb(134, 134, 134);
  padding: 1em;
  border-radius: 7px;
  width: 40;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 5px;
}

dt#blackspace-button {
  width: 110px;
}
dt#space-button {
  border: 1px solid #8c8c8c;
  width: 280px;
  height: 30px;
  margin: 0 auto;
  margin-top: 10px;
  border-radius: 4px;
}

dt#blackslash {
  width: 50px;
}

@media (max-width: 1200px) {
  ul.keyboard {
    width: 400px;
    width: max-content;
    margin: 0 auto;
    margin-top: 30px;
  }
  ul.keyboard li dt {
    border-radius: 7px;
    width: 40px;
    height: 40px;
  }
}

@media (max-width: 790px) {
  ul.keyboard {
    display: none;
  }
}
</style>
