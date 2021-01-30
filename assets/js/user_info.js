$(function () {
  let form = layui.form
  form.verify({
    nickname: function (value) {
      if (value.length < 3 || value.length > 12) {
        return '昵称必须在3——16个字符之间'
      }
    }
  })
  // 初始化用户信息，填充用户表单
  initUserInfo()
  function initUserInfo() {
    $.ajax({
      type: 'GET',
      url: '/my/userinfo',
      success(res) {
        if (res.status !== 0) {
          return layui.layer.msg('获取用户信息失败！')
        }
        console.log(res.data);
        form.val('formUserInfo', res.data)
      }
    })
  }
  //表单重置
  $('#btn-reset').on('click', function (e) {
    e.preventDefault()
    initUserInfo()
  })
  //监听表单提交
  $('.layui-form').on('submit', function (e) {
    e.preventDefault()
    $.ajax({
      type: 'POST',
      url: '/my/userinfo',
      data: $(this).serialize(),
      success(res) {
        if (res.status !== 0) {
          return layui.layer.msg('更新数据失败')
        }
        layui.layer.msg('更新用户信息成功！')
        // 调用父页面index.html中的方法，重新渲染用户的头像和用户的信息
        window.parent.getUserInfo()
      }
    })
  })
})
