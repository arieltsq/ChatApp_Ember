/* global $ */
import Ember from 'ember'

export default Ember.Controller.extend({
  socketIOService: Ember.inject.service('socket-io'),

  msg: [],
  names: '',
  detail: '',
  welcome: '',

  init: function () {
    this._super.apply(this, arguments)

    // deployment on local host
    var socket = this.get('socketIOService').socketFor('http://localhost:3000/')
    // delopyment to heroku
    // var socket = this.get('socketIOService').socketFor(window.location.host)

    socket.on('connect', function () {
      console.log('Connected to Chat Socket')
    })
    socket.on('disconnect', function () {
      console.log('Disconnected from Chat Socket')
    })

    // using fat arrow function, it will bind the scope of "this" to the physical location
    socket.on('chat', (msg) => {
      console.log('Received message: ', msg)
      $('#secondPanel').removeClass('hide')
      this.msg.unshiftObject(msg)
    })

    socket.on('joined', (user) => {
      console.log(user.name + ' joined the chat.')

      $('#details').removeClass('hide')
      //  this.detail.unshiftObject(user)

      this.set('detail', user.name)

    // $('#messages').prepend($('<c class="text-center">').html('<strong>' + user.name + '  joined the chat <strong>'))
    })

    socket.on('welcome', (msg) => {
      console.log('Received welcome message: ', msg)
      $('#welcome').removeClass('hide')
      if (welcome.empty()) {
        console.log('this is empty')
      }else {
        console.log('not empty')
      }
      this.set('welcome', msg)

    // enable the form and add welcome message
    // $('main').removeClass('hidden')
    //    $('#messages').prepend($('<div class="text-center">').html('<strong>' + msg + '<strong>'))
    })

    socket.on('online', (connections) => {
      var names = ''
      console.log('Connections: ', connections)
      for (var i = 0; i < connections.length; ++i) {
        if (connections[i].user) {
          if (i > 0) {
            if (i === connections.length) names += ' and '
            else names += ', '
          }
          names += connections[i].user.name
        }
      }
      //  $('#connected').text("Online Users:", names)
      $('#connected').removeClass('hide')
      $('#firstPanel').removeClass('hide')
      this.set('names', names)
    })
  },

  onMessage: function (data) {
    // This is executed within the ember run loop
  },

  actions: {
    submitMessage () {
      // delopyment on local host
      var socket = this.get('socketIOService').socketFor('http://localhost:3000/')
      // delopyment to heroku
      //  var socket = this.get('socketIOService').socketFor(window.location.host)
      console.log('Clicked')
      let msg = {
        message: this.get('message'),
        name: this.get('name')
      }

      this.msg.unshiftObject(msg)
      socket.emit('join', msg)
      $('#secondPanel').removeClass('hide')

      socket.emit('chat', this.get('message'), this.get('name'))
    }
  }
})
