const _0x32020c=_0x275a;(function(_0x57cb0f,_0x36abcc){const _0x9f7aaa=_0x275a,_0x575272=_0x57cb0f();while(!![]){try{const _0x23dfb8=parseInt(_0x9f7aaa(0x14f))/0x1*(parseInt(_0x9f7aaa(0x14e))/0x2)+parseInt(_0x9f7aaa(0x12f))/0x3+-parseInt(_0x9f7aaa(0x156))/0x4+parseInt(_0x9f7aaa(0x138))/0x5+-parseInt(_0x9f7aaa(0x160))/0x6*(-parseInt(_0x9f7aaa(0x161))/0x7)+parseInt(_0x9f7aaa(0x164))/0x8*(-parseInt(_0x9f7aaa(0x147))/0x9)+parseInt(_0x9f7aaa(0x12e))/0xa;if(_0x23dfb8===_0x36abcc)break;else _0x575272['push'](_0x575272['shift']());}catch(_0x5eb873){_0x575272['push'](_0x575272['shift']());}}}(_0x87c5,0x23c21));import{initializeApp}from'https://www.gstatic.com/firebasejs/9.4.1/firebase-app.js';import{getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword,sendEmailVerification,deleteUser}from'https://www.gstatic.com/firebasejs/9.4.1/firebase-auth.js';import{getFirestore,collection,doc,setDoc,addDoc,getDoc}from'https://www.gstatic.com/firebasejs/9.4.1/firebase-firestore.js';function _0x87c5(){const _0x5208d9=['1718590pjXRBK','148863ACgPEi','length','945052022593','iStrasse','haushelper-12f14.firebaseapp.com','value','passwordError','emailError','now','510200xFujGh','message','color','transparent','signup-form','currentUser','red','white','innerHTML','emailInUseError','companyError','user','passwordError2','iPasswort2','iName','333wnaZKc','exists','1:945052022593:web:e6889785d166df5e0653c0','addEventListener','https://buy.stripe.com/00gdRL8Bfc9EaE8eUU?client_reference_id=','passwordError3','height','8644AnLphI','16lxrJzQ','style','catch','location','100%','successMessage1','width','708292vjcdHq','test','AIzaSyBWhH4qYxVx2NWYUNnkY7rfviGEelwg7oQ','30px','iPLZ','getElementById','Admins','Companies','successText','0px','18xoJWeY','118321IuCxBw','code','cus_','25912JLjgxb','stopPropagation','then','passwordError4','iPhone','haushelper-12f14','submit','iPasswort'];_0x87c5=function(){return _0x5208d9;};return _0x87c5();}function _0x275a(_0x3991ec,_0x4d9426){const _0x87c5f8=_0x87c5();return _0x275a=function(_0x275ad0,_0x275ffa){_0x275ad0=_0x275ad0-0x12a;let _0x414523=_0x87c5f8[_0x275ad0];return _0x414523;},_0x275a(_0x3991ec,_0x4d9426);}const firebaseConfig={'apiKey':_0x32020c(0x158),'authDomain':_0x32020c(0x133),'projectId':_0x32020c(0x12b),'storageBucket':'haushelper-12f14.appspot.com','messagingSenderId':_0x32020c(0x131),'appId':_0x32020c(0x149)},app=initializeApp(firebaseConfig),auth=getAuth(app),db=getFirestore(app);let signUpForm=document['getElementById'](_0x32020c(0x13c));function validateEmail(_0xd061a8){const _0xa5eb1b=_0x32020c,_0x46049=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;return _0x46049[_0xa5eb1b(0x157)](String(_0xd061a8)['toLowerCase']());}typeof signUpForm!==null&&signUpForm[_0x32020c(0x14a)](_0x32020c(0x12c),handleSignUp,!![]);function handleSignUp(_0x40b8b0){const _0x28a21b=_0x32020c;_0x40b8b0['preventDefault'](),_0x40b8b0[_0x28a21b(0x165)]();const _0x39c7ce=document[_0x28a21b(0x15b)]('iEmail')[_0x28a21b(0x134)],_0x464c59=document[_0x28a21b(0x15b)](_0x28a21b(0x12d))[_0x28a21b(0x134)],_0x37ecdb=document[_0x28a21b(0x15b)](_0x28a21b(0x145))[_0x28a21b(0x134)],_0x422dc2=/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;if(!validateEmail(_0x39c7ce)){document[_0x28a21b(0x15b)](_0x28a21b(0x136))[_0x28a21b(0x150)]['height']='30px',document['getElementById'](_0x28a21b(0x136))[_0x28a21b(0x150)]['color']='red';return;}else document[_0x28a21b(0x15b)](_0x28a21b(0x136))[_0x28a21b(0x150)]['height']=_0x28a21b(0x15f),document[_0x28a21b(0x15b)](_0x28a21b(0x136))['style'][_0x28a21b(0x13a)]=_0x28a21b(0x13b);if(_0x464c59!=_0x37ecdb){document[_0x28a21b(0x15b)](_0x28a21b(0x135))['style']['height']=_0x28a21b(0x159),document[_0x28a21b(0x15b)](_0x28a21b(0x135))[_0x28a21b(0x150)][_0x28a21b(0x13a)]=_0x28a21b(0x13e),document['getElementById'](_0x28a21b(0x144))[_0x28a21b(0x150)][_0x28a21b(0x14d)]=_0x28a21b(0x159),document[_0x28a21b(0x15b)](_0x28a21b(0x144))[_0x28a21b(0x150)][_0x28a21b(0x13a)]=_0x28a21b(0x13e);return;}else document['getElementById'](_0x28a21b(0x135))[_0x28a21b(0x150)][_0x28a21b(0x14d)]=_0x28a21b(0x15f),document[_0x28a21b(0x15b)]('passwordError')[_0x28a21b(0x150)][_0x28a21b(0x13a)]=_0x28a21b(0x13b),document[_0x28a21b(0x15b)](_0x28a21b(0x144))[_0x28a21b(0x150)][_0x28a21b(0x14d)]='0px',document[_0x28a21b(0x15b)](_0x28a21b(0x144))['style']['color']=_0x28a21b(0x13b);if(_0x464c59[_0x28a21b(0x130)]>=0x6)document[_0x28a21b(0x15b)]('passwordError3')['style'][_0x28a21b(0x14d)]=_0x28a21b(0x15f),document[_0x28a21b(0x15b)]('passwordError3')[_0x28a21b(0x150)][_0x28a21b(0x13a)]='transparent',document[_0x28a21b(0x15b)](_0x28a21b(0x167))[_0x28a21b(0x150)][_0x28a21b(0x14d)]=_0x28a21b(0x15f),document[_0x28a21b(0x15b)](_0x28a21b(0x167))[_0x28a21b(0x150)][_0x28a21b(0x13a)]=_0x28a21b(0x13b);else{document[_0x28a21b(0x15b)](_0x28a21b(0x14c))['style']['height']='30px',document[_0x28a21b(0x15b)](_0x28a21b(0x14c))[_0x28a21b(0x150)][_0x28a21b(0x13a)]=_0x28a21b(0x13e),document[_0x28a21b(0x15b)]('passwordError4')[_0x28a21b(0x150)][_0x28a21b(0x14d)]=_0x28a21b(0x159),document[_0x28a21b(0x15b)](_0x28a21b(0x167))[_0x28a21b(0x150)][_0x28a21b(0x13a)]=_0x28a21b(0x13e);return;}createUserWithEmailAndPassword(auth,_0x39c7ce,_0x464c59)[_0x28a21b(0x166)](_0x5800dc=>{const _0xa9cef6=_0x28a21b,_0x39f7b6=_0x5800dc['user'];signInWithEmailAndPassword(auth,_0x39c7ce,_0x464c59)[_0xa9cef6(0x166)](_0x17ac0f=>{const _0x496daf=_0xa9cef6,_0x118fab=_0x17ac0f[_0x496daf(0x143)],_0x10dc4e=_0x496daf(0x163)+Date[_0x496daf(0x137)](),_0x35ecab={'abo':'2','aboName':'Basic','facilityAvailable':'5','facilityInit':'5','purchased':new Date(),'userAvailable':'5','userInit':'5','clientRef':_0x10dc4e},_0x3b76bd=doc(collection(db,_0x496daf(0x15d)),document['getElementById']('iFirma')['value']),_0x58dbff=getDoc(_0x3b76bd);getDoc(_0x3b76bd)[_0x496daf(0x166)](_0xf4730b=>{const _0x29de00=_0x496daf;if(_0xf4730b[_0x29de00(0x148)]()){document[_0x29de00(0x15b)]('companyError')['style'][_0x29de00(0x14d)]=_0x29de00(0x159),document[_0x29de00(0x15b)](_0x29de00(0x142))[_0x29de00(0x150)]['color']=_0x29de00(0x13e),deleteUser(auth[_0x29de00(0x13d)])[_0x29de00(0x166)](()=>{})[_0x29de00(0x151)](_0x8060b8=>{});return;}else{document[_0x29de00(0x15b)](_0x29de00(0x142))[_0x29de00(0x150)][_0x29de00(0x14d)]=_0x29de00(0x15f),document['getElementById'](_0x29de00(0x142))[_0x29de00(0x150)][_0x29de00(0x13a)]=_0x29de00(0x13b),document[_0x29de00(0x15b)](_0x29de00(0x154))[_0x29de00(0x150)][_0x29de00(0x155)]=_0x29de00(0x153),document['getElementById'](_0x29de00(0x15e))[_0x29de00(0x150)][_0x29de00(0x13a)]=_0x29de00(0x13f),sendEmailVerification(auth[_0x29de00(0x13d)])[_0x29de00(0x166)](()=>{})[_0x29de00(0x151)](_0x335b5d=>{}),setDoc(_0x3b76bd,{});const _0x341ec6=collection(_0x3b76bd,'Accesses'),_0x52d1fe={'company':document[_0x29de00(0x15b)]('iFirma')[_0x29de00(0x134)],'email':document[_0x29de00(0x15b)]('iEmail')[_0x29de00(0x134)],'name':document['getElementById'](_0x29de00(0x146))[_0x29de00(0x134)],'surname':document[_0x29de00(0x15b)]('iVorname')[_0x29de00(0x134)],'plz':document[_0x29de00(0x15b)](_0x29de00(0x15a))[_0x29de00(0x134)],'hausnummer':document[_0x29de00(0x15b)]('iHausnummer')[_0x29de00(0x134)],'strasse':document[_0x29de00(0x15b)](_0x29de00(0x132))[_0x29de00(0x134)],'ort':document['getElementById']('iOrt')[_0x29de00(0x134)],'phone':document['getElementById'](_0x29de00(0x12a))['value']},_0x3fef44=collection(db,_0x29de00(0x15c));addDoc(_0x341ec6,_0x35ecab)[_0x29de00(0x166)](()=>{return addDoc(_0x3fef44,_0x52d1fe);})[_0x29de00(0x166)](()=>{const _0x27b6a5=_0x29de00;window[_0x27b6a5(0x152)]['href']=_0x27b6a5(0x14b)+_0x10dc4e;});}});})[_0xa9cef6(0x151)](_0x51453d=>{const _0x12fcda=_0xa9cef6,_0x297fb3=_0x51453d['code'],_0xcf8200=_0x51453d[_0x12fcda(0x139)];var _0x144827=document[_0x12fcda(0x15b)]('signup-error-message');_0x144827[_0x12fcda(0x140)]=_0xcf8200;});})['catch'](_0x14c3e7=>{const _0x19c266=_0x28a21b,_0x4c3249=_0x14c3e7[_0x19c266(0x162)];_0x4c3249==='auth/email-already-in-use'?(document['getElementById'](_0x19c266(0x141))[_0x19c266(0x150)]['height']='30px',document[_0x19c266(0x15b)](_0x19c266(0x141))[_0x19c266(0x150)][_0x19c266(0x13a)]=_0x19c266(0x13e)):(document[_0x19c266(0x15b)](_0x19c266(0x141))[_0x19c266(0x150)][_0x19c266(0x14d)]=_0x19c266(0x15f),document['getElementById']('emailInUseError')[_0x19c266(0x150)]['color']=_0x19c266(0x13b));return;});}