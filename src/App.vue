<template>
  <div id="app">
    <!-- 전역 헤더 영역 -->
    <!-- <header> -->
      <!-- <h1>My App</h1> -->
    <!-- </header> -->

    <!-- 라우터가 표시할 컴포넌트 영역 -->
    <router-view></router-view>

    <!-- 전역 푸터 영역 -->
    <!-- <footer> -->
      <!-- <p>&copy; 2023 My App</p> -->
    <!-- </footer> -->
  </div>
</template>

<script>
// 다른 Vue 파일이나 컴포넌트를 가져오거나 설정할 수 있음
export default {
  name: 'App',
  // 필요한 전역 상태나 메소드 등을 설정할 수 있음
};
</script>
<style>
body {
  font-family: 'Arial', sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  text-align: center;
}

header, footer {
  background-color: #333;
  color: white;
}

router-view {
  margin-top: 20px;
  width: 620px;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
}
</style>
