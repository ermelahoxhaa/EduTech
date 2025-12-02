<template>
<footer class="footer">
  <div class="container">

    <div class="map">
      <img src="@/assets/edutech-map.png" alt="map" />
    </div>

    <div class="row">
      <div class="footer-col">
        <h4>Contact Us</h4>
        <ul>
          <li>
            <a href="#">
              At Bulevardi Bill Clinton<br>
              Prishtinë, Kosovë<br>
              +383 49 555 222
            </a>
          </li>
          <li><a href="#">support@edutechplatform.com</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h4>Platform</h4>
        <ul>
          <li><a href="#">Courses</a></li>
          <li><a href="#">Instructors</a></li>
          <li><a href="#">Student Dashboard</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h4>Follow Us</h4>
        <ul>
          <li><a href="#">Facebook</a></li>
          <li><a href="#">Instagram</a></li>
          <li><a href="#">LinkedIn</a></li>
        </ul>
      </div>
    </div>
  </div>

  <div class="copyrights">
    <p>Copyright © 2025 EduTech. All rights reserved!</p>
  </div>
</footer>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600&display=swap');

.footer {
  background-color: #f3f6fc;
  font-family: 'Quicksand', sans-serif;
  font-size: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 10px 0px 8px rgba(129, 129, 129, 0.08);
  border-top-left-radius: 50px;
  border-top-right-radius: 50px;
  padding-top: 20px;
}

.container {
  max-width: 1480px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.map {
  padding-right: 40px;
}

.map img {
  width: 300px;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0,0,0,0.05);
}

.row {
  display: flex;
  flex-wrap: wrap;
  margin-left: 260px;
}

.footer-col {
  padding: 40px;
  width: auto;
}

.footer-col h4 {
  margin-bottom: 20px;
  text-decoration: overline;
  color: #0d1930;
}

.footer-col ul {
  padding: 0;
  list-style: none;
}

.footer-col ul li {
  margin-bottom: 10px;
}

.footer-col ul li a {
  color: #42506b;
  text-decoration: none;
  transition: 0.3s;
}

.footer-col ul li a:hover {
  color: #0b56d1;
}

.copyrights {
  text-align: center;
  padding: 20px 0;
  width: 100%;
  background-color: #f3f6fc;
  color: #333;
}

@media (max-width: 780px) {
  .container {
    flex-direction: column;
    padding: 10px;
    width: 100%;
  }

  .row {
    flex-direction: column;
    margin-left: 0;
    align-items: center;
    width: 100%;
  }

  .footer-col {
    padding: 20px;
    width: 100%;
    text-align: center;
  }

  .map {
    padding: 0;
    margin-bottom: 20px;
  }
}
</style>
