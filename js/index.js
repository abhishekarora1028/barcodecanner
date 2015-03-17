/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // `load`, `deviceready`, `offline`, and `online`.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.getElementById('scan').addEventListener('click', this.scan, false);
        document.getElementById('encode').addEventListener('click', this.encode, false);
    },

    // deviceready Event Handler
    //
    // The scope of `this` is the event. In order to call the `receivedEvent`
    // function, we must explicity call `app.receivedEvent(...);`
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },

    scan: function() {
        console.log('scanning');
        
        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

        scanner.scan( function (result) { 

           /* alert("We got a barcode\n" + 
            "Result: " + result.text + "\n" + 
            "Format: " + result.format + "\n" + 
            "Cancelled: " + result.cancelled); */
                $('#code').val(result.text);
                if(result.text!='')
                {
                    //check if message exists
                    $.ajax({
                        dataType: "json",
                        url: "http://www.aroracomfortechs.com/projects/myloveping/getmessage.php?code="+result.text,
                        async: false,
                        type: "GET",
                        success:function(responseData) { 
                            if(responseData == 'notFound')
                            {
                              $('#addmessage').show();
                            }
                            else
                             {
                                $('#showmessage').text(responseData).show();   
                             }

                    }
                    });
                }

           console.log("Scanner result: \n" +
                "text: " + result.text + "\n" +
                "format: " + result.format + "\n" +
                "cancelled: " + result.cancelled + "\n");
            document.getElementById("info").innerHTML = result.text;
            console.log(result);
            /*
            if (args.format == "QR_CODE") {
                window.plugins.childBrowser.showWebPage(args.text, { showLocationBar: false });
            }
            */

        }, function (error) { 
            console.log("Scanning failed: ", error); 
        } );
    },

    encode: function() {
        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

        scanner.encode(scanner.Encode.TEXT_TYPE, "http://www.nhl.com", function(success) {
            alert("encode success: " + success);
          }, function(fail) {
            alert("encoding failed: " + fail);
          }
        );

    }

};

$(document).ready(function(){
    $('#deletemessage').click(function(){
       var code  =  $('#code').val();
        $.ajax({
                        dataType: "json",
                        url: "http://www.aroracomfortechs.com/projects/myloveping/deletemessage.php?code="+code ,
                        async: false,
                        type: "GET",
                        success:function(responseData) { 
                            if(responseData == 'deleted')
                            {
                                $('#showmessage').hide();
                                $('#maindiv').show();
                                $('#responsemessage').css('background','green');
                                $('#responsemessage').text('Message deleted successfully.. Send new message').show(); 
                                setTimeout(function(){$('#responsemessage').hide(500)}, 3000);   
                            }
                            else
                            {
                                $('#responsemessage').css('background','red');
                                $('#responsemessage').text('Error in deleting message').show(); 
                                setTimeout(function(){$('#responsemessage').hide(500)}, 3000); 
                            }

                    }
                    });

    });
    $('#submitmessage').click(function(){
        var code  =  $('#code').val();
        var message  =  $('#message').val();
        $.ajax({
                        url: "http://www.aroracomfortechs.com/projects/myloveping/savemessage.php",
                        async: false,
                        type: "POST",
                        data:{'code':code,'message':message},
                        success:function(responseData) { 
                            if(responseData == 'success')
                            {
                                $('#addmessage').hide();
                                $('#maindiv').show();
                                $('#responsemessage').css('background','green');
                                $('#responsemessage').text('Message added successfully.. Send new message').show(); 
                                setTimeout(function(){$('#responsemessage').hide(500)}, 3000);   
                            }
                            else
                             {
                                $('#responsemessage').css('background','red');
                                $('#responsemessage').text('Error in saving message..Please try again').show();   
                                setTimeout(function(){$('#responsemessage').hide(500)}, 3000);
                             }

                    }
                    });
    });
});
