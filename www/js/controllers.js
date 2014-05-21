angular.module('frontpage.controllers', [])

.controller('FrontPageCtrl', function($scope, HNAPI, RequestCache, $state, $timeout) {
  $scope.posts = RequestCache.get('frontpage/0');
  var currentPage = 0;
  HNAPI.frontpage(0).then(function(posts){
    $scope.posts = posts;
  });
  $scope.refresh = function(){
    HNAPI.frontpage(0).then(function(posts){
      $timeout(function(){
        $scope.posts = posts;
        $scope.$broadcast('scroll.refreshComplete');
      },1000);
    });
  }
  $scope.open = function(url){
    // cordova tends to keep these in memory after they're gone so we'll help it forget
    var iab = window.open(url,'_blank','location=no,enableViewportScale=yes,toolbarposition=top,transitionstyle=crossdissolve,closebuttoncaption=Done');
    iab.addEventListener('exit', function(e) {
      iab.removeEventListener('exit', argument.callee);
      iab.close();
      iab = null;
    });
  }
  $scope.loadMoreData = function(){
    currentPage++;
    console.log('loading page '+currentPage);
    HNAPI.frontpage(currentPage).then(function(posts){
      $scope.posts = $scope.posts.concat(posts);
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  }
  $scope.loadComments = function(storyID){
    $state.go('tab.front-page-comments',{storyID:storyID});
  }
})

.controller('NewestCtrl', function($scope, HNAPI, RequestCache, $state, $timeout) {
  $scope.posts = RequestCache.get('newest/0');
  var currentPage = 0;
  HNAPI.newest(0).then(function(posts){
    $scope.posts = posts;
  });
  $scope.refresh = function(){
    HNAPI.newest(0).then(function(posts){
      $timeout(function(){
        $scope.posts = posts;
        $scope.$broadcast('scroll.refreshComplete');
      },1000);
    });
  }
  $scope.refresh();
  $scope.open = function(url){
    // cordova tends to keep these in memory after they're gone so we'll help it forget
    var iab = window.open(url,'_blank','location=no,enableViewportScale=yes,toolbarposition=top,transitionstyle=crossdissolve,closebuttoncaption=Done');
    iab.addEventListener('exit', function(e) {
      iab.removeEventListener('exit', argument.callee);
      iab.close();
      iab = null;
    });
  }
  $scope.loadMoreData = function(){
    currentPage++;
    console.log('loading page '+currentPage);
    HNAPI.newest(currentPage).then(function(posts){
      $scope.posts = $scope.posts.concat(posts);
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  }
  $scope.loadComments = function(storyID){
    $state.go('tab.newest-comments',{storyID:storyID});
  }
})

.controller('CommentsCtrl', function($scope, HNAPI, $stateParams, $ionicLoading) {
  $ionicLoading.show({
    template: 'Loading...'
  });
  HNAPI.comments($stateParams.storyID).then(function(comments){
    $scope.comments = comments;
    $ionicLoading.hide();
  });
})

.controller('SearchCtrl', function($scope, HNAPI, $ionicLoading, $state) {
  $scope.focused= 'text-center'
  $scope.searchTerm = '';
  $scope.posts = [];
  console.log(localStorage.searchCache);
  if(typeof localStorage.searchCache != 'undefined'){
    var sc = JSON.parse(localStorage.searchCache);
    $scope.searchTerm = sc.term;
    $scope.posts = sc.results;
    $scope.focused = 'left-center';
  }
  $scope.search = function(searchTerm){
    $ionicLoading.show({
      template: 'Searching...'
    });
    document.getElementById('searchInput').blur();
    HNAPI.search(searchTerm).then(function(searchResults){
      $scope.posts = searchResults;
      localStorage.searchCache = JSON.stringify({term:searchTerm,results:searchResults});
      $ionicLoading.hide();
    },function(){
      $scope.posts = [];
      $ionicLoading.hide();
    });
  };
  $scope.open = function(url){
    // cordova tends to keep these in memory after they're gone so we'll help it forget
    var iab = window.open(url,'_blank','location=no,enableViewportScale=yes,toolbarposition=top,transitionstyle=crossdissolve,closebuttoncaption=Done');
    iab.addEventListener('exit', function(e) {
      iab.removeEventListener('exit', argument.callee);
      iab.close();
      iab = null;
    });
  }
  $scope.clear = function(){
    $scope.posts = [];
    $scope.searchTerm = '';
    $scope.focused = 'text-center';
    document.getElementById('searchInput').blur();
    delete localStorage.searchCache;
  }
  $scope.loadComments = function(storyID){
    $state.go('tab.search-comments',{storyID:storyID});
  }
})
;
