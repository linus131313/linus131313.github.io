const _0x532353=_0x5681;(function(_0x4fad9a,_0x51edfb){const _0x52c8de=_0x5681,_0x125157=_0x4fad9a();while(!![]){try{const _0x43dc36=parseInt(_0x52c8de(0x9c))/0x1+parseInt(_0x52c8de(0xb5))/0x2+parseInt(_0x52c8de(0xb8))/0x3*(parseInt(_0x52c8de(0x9b))/0x4)+parseInt(_0x52c8de(0xb6))/0x5*(-parseInt(_0x52c8de(0xb7))/0x6)+parseInt(_0x52c8de(0x9d))/0x7*(parseInt(_0x52c8de(0xd5))/0x8)+parseInt(_0x52c8de(0xcb))/0x9*(-parseInt(_0x52c8de(0xbe))/0xa)+-parseInt(_0x52c8de(0xde))/0xb;if(_0x43dc36===_0x51edfb)break;else _0x125157['push'](_0x125157['shift']());}catch(_0x9c77e9){_0x125157['push'](_0x125157['shift']());}}}(_0x1e3b,0x5dc6f));import{initializeApp}from'https://www.gstatic.com/firebasejs/9.4.1/firebase-app.js';import{getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut,onAuthStateChanged,sendEmailVerification,deleteUser}from'https://www.gstatic.com/firebasejs/9.4.1/firebase-auth.js';function _0x5681(_0x56caea,_0x236d08){const _0x1e3b32=_0x1e3b();return _0x5681=function(_0x568141,_0x2db8ce){_0x568141=_0x568141-0x98;let _0x4df48d=_0x1e3b32[_0x568141];return _0x4df48d;},_0x5681(_0x56caea,_0x236d08);}import{getFirestore,collection,doc,setDoc,getDocs,addDoc,getDoc}from'https://www.gstatic.com/firebasejs/9.4.1/firebase-firestore.js';const firebaseConfig={'apiKey':_0x532353(0xa5),'authDomain':'haushelper-12f14.firebaseapp.com','projectId':_0x532353(0xc2),'storageBucket':_0x532353(0xa9),'messagingSenderId':_0x532353(0xab),'appId':'1:945052022593:web:e6889785d166df5e0653c0'},app=initializeApp(firebaseConfig),auth=getAuth(app),db=getFirestore(app);let signUpForm=document[_0x532353(0x9e)](_0x532353(0xd6));function validateEmail(_0x4088dc){const _0x15b2ac=_0x532353,_0x528ea3=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;return _0x528ea3[_0x15b2ac(0xc8)](String(_0x4088dc)[_0x15b2ac(0xdb)]());}typeof signUpForm!==null&&signUpForm[_0x532353(0x9a)](_0x532353(0xac),handleSignUp,!![]);function _0x1e3b(){const _0x649649=['location','haushelper-12f14.appspot.com','white','945052022593','submit','code','transparent','successText','now','preventDefault','red','10000','value','1499694fIpCkf','10vdWThj','1772616JFxvIq','102RzPxTn','passwordError3','iEmail','emailInUseError','currentUser','iPLZ','90140YkAeAN','iOrt','length','100%','haushelper-12f14','Unlimited','then','iPhone','style','iPasswort','test','companyError','signup-error-message','459FvLCVE','catch','passwordError','height','iHausnummer','successMessage1','0px','emailError','30px','Companies','3640fYaJys','signup-form','iPasswort2','innerHTML','Accesses','exists','toLowerCase','user','iVorname','94490ZWjaEf','width','passwordError2','addEventListener','18764cjqBlp','255941pwrOYK','4277lnwbkk','getElementById','color','iFirma','iName','passwordError4','iStrasse','cus_','AIzaSyBWhH4qYxVx2NWYUNnkY7rfviGEelwg7oQ','stopPropagation','message'];_0x1e3b=function(){return _0x649649;};return _0x1e3b();}function handleSignUp(_0x4ee08b){const _0x192c9c=_0x532353;_0x4ee08b[_0x192c9c(0xb1)](),_0x4ee08b[_0x192c9c(0xa6)]();const _0xef725e=document['getElementById'](_0x192c9c(0xba))[_0x192c9c(0xb4)],_0x5aeb06=document['getElementById'](_0x192c9c(0xc7))['value'],_0x446cda=document['getElementById'](_0x192c9c(0xd7))[_0x192c9c(0xb4)],_0x570bfa=/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;if(!validateEmail(_0xef725e)){document[_0x192c9c(0x9e)](_0x192c9c(0xd2))[_0x192c9c(0xc6)][_0x192c9c(0xce)]=_0x192c9c(0xd3),document[_0x192c9c(0x9e)](_0x192c9c(0xd2))[_0x192c9c(0xc6)]['color']=_0x192c9c(0xb2);return;}else document[_0x192c9c(0x9e)](_0x192c9c(0xd2))[_0x192c9c(0xc6)][_0x192c9c(0xce)]=_0x192c9c(0xd1),document[_0x192c9c(0x9e)](_0x192c9c(0xd2))[_0x192c9c(0xc6)][_0x192c9c(0x9f)]=_0x192c9c(0xae);if(_0x5aeb06!=_0x446cda){document[_0x192c9c(0x9e)](_0x192c9c(0xcd))[_0x192c9c(0xc6)][_0x192c9c(0xce)]=_0x192c9c(0xd3),document['getElementById']('passwordError')['style'][_0x192c9c(0x9f)]=_0x192c9c(0xb2),document[_0x192c9c(0x9e)](_0x192c9c(0x99))[_0x192c9c(0xc6)][_0x192c9c(0xce)]=_0x192c9c(0xd3),document['getElementById']('passwordError2')[_0x192c9c(0xc6)][_0x192c9c(0x9f)]='red';return;}else document[_0x192c9c(0x9e)](_0x192c9c(0xcd))[_0x192c9c(0xc6)][_0x192c9c(0xce)]=_0x192c9c(0xd1),document[_0x192c9c(0x9e)](_0x192c9c(0xcd))[_0x192c9c(0xc6)][_0x192c9c(0x9f)]=_0x192c9c(0xae),document[_0x192c9c(0x9e)](_0x192c9c(0x99))['style'][_0x192c9c(0xce)]=_0x192c9c(0xd1),document[_0x192c9c(0x9e)]('passwordError2')[_0x192c9c(0xc6)][_0x192c9c(0x9f)]='transparent';if(_0x5aeb06[_0x192c9c(0xc0)]>=0x6)document[_0x192c9c(0x9e)](_0x192c9c(0xb9))[_0x192c9c(0xc6)]['height']=_0x192c9c(0xd1),document[_0x192c9c(0x9e)](_0x192c9c(0xb9))['style'][_0x192c9c(0x9f)]='transparent',document['getElementById'](_0x192c9c(0xa2))[_0x192c9c(0xc6)]['height']=_0x192c9c(0xd1),document[_0x192c9c(0x9e)](_0x192c9c(0xa2))[_0x192c9c(0xc6)][_0x192c9c(0x9f)]=_0x192c9c(0xae);else{document[_0x192c9c(0x9e)](_0x192c9c(0xb9))[_0x192c9c(0xc6)][_0x192c9c(0xce)]=_0x192c9c(0xd3),document[_0x192c9c(0x9e)](_0x192c9c(0xb9))[_0x192c9c(0xc6)][_0x192c9c(0x9f)]='red',document[_0x192c9c(0x9e)]('passwordError4')[_0x192c9c(0xc6)][_0x192c9c(0xce)]=_0x192c9c(0xd3),document[_0x192c9c(0x9e)](_0x192c9c(0xa2))[_0x192c9c(0xc6)][_0x192c9c(0x9f)]=_0x192c9c(0xb2);return;}createUserWithEmailAndPassword(auth,_0xef725e,_0x5aeb06)[_0x192c9c(0xc4)](_0x4242f0=>{const _0x1527c3=_0x192c9c,_0x348f4c=_0x4242f0[_0x1527c3(0xdc)];signInWithEmailAndPassword(auth,_0xef725e,_0x5aeb06)[_0x1527c3(0xc4)](_0x272189=>{const _0x111a84=_0x1527c3,_0x288203=_0x272189['user'],_0x560689=_0x111a84(0xa4)+Date[_0x111a84(0xb0)](),_0xdef84e={'abo':'4','aboName':_0x111a84(0xc3),'facilityAvailable':_0x111a84(0xb3),'facilityInit':_0x111a84(0xb3),'purchased':new Date(),'userAvailable':_0x111a84(0xb3),'userInit':_0x111a84(0xb3),'clientRef':_0x560689},_0x3af5fa=doc(collection(db,_0x111a84(0xd4)),document[_0x111a84(0x9e)](_0x111a84(0xa0))[_0x111a84(0xb4)]),_0x2e6958=getDoc(_0x3af5fa);getDoc(_0x3af5fa)['then'](_0x2e9430=>{const _0x499532=_0x111a84;if(_0x2e9430[_0x499532(0xda)]()){document['getElementById'](_0x499532(0xc9))[_0x499532(0xc6)][_0x499532(0xce)]=_0x499532(0xd3),document[_0x499532(0x9e)]('companyError')[_0x499532(0xc6)]['color']=_0x499532(0xb2),deleteUser(auth[_0x499532(0xbc)])[_0x499532(0xc4)](()=>{})[_0x499532(0xcc)](_0x30acfe=>{});return;}else{document[_0x499532(0x9e)]('companyError')['style'][_0x499532(0xce)]=_0x499532(0xd1),document[_0x499532(0x9e)](_0x499532(0xc9))[_0x499532(0xc6)]['color']='transparent',document[_0x499532(0x9e)](_0x499532(0xd0))['style'][_0x499532(0x98)]=_0x499532(0xc1),document[_0x499532(0x9e)](_0x499532(0xaf))[_0x499532(0xc6)][_0x499532(0x9f)]=_0x499532(0xaa),sendEmailVerification(auth['currentUser'])[_0x499532(0xc4)](()=>{})[_0x499532(0xcc)](_0x444870=>{}),setDoc(_0x3af5fa,{});const _0x86dd81=collection(_0x3af5fa,_0x499532(0xd9));addDoc(_0x86dd81,_0xdef84e);const _0xd28eb5={'company':document['getElementById']('iFirma')[_0x499532(0xb4)],'email':document[_0x499532(0x9e)](_0x499532(0xba))[_0x499532(0xb4)],'name':document['getElementById'](_0x499532(0xa1))[_0x499532(0xb4)],'surname':document[_0x499532(0x9e)](_0x499532(0xdd))['value'],'plz':document[_0x499532(0x9e)](_0x499532(0xbd))[_0x499532(0xb4)],'hausnummer':document[_0x499532(0x9e)](_0x499532(0xcf))[_0x499532(0xb4)],'strasse':document[_0x499532(0x9e)](_0x499532(0xa3))[_0x499532(0xb4)],'ort':document['getElementById'](_0x499532(0xbf))[_0x499532(0xb4)],'phone':document[_0x499532(0x9e)](_0x499532(0xc5))[_0x499532(0xb4)]},_0x2ff867=collection(db,'Admins');addDoc(_0x2ff867,_0xd28eb5),window[_0x499532(0xa8)]['href']='https://buy.stripe.com/7sIbJD04J1v0fYsfZ0?client_reference_id='+_0x560689;}});})[_0x1527c3(0xcc)](_0x2f015b=>{const _0x20918a=_0x1527c3,_0x461a80=_0x2f015b[_0x20918a(0xad)],_0x3efc1f=_0x2f015b[_0x20918a(0xa7)];var _0x395bc9=document[_0x20918a(0x9e)](_0x20918a(0xca));_0x395bc9[_0x20918a(0xd8)]=_0x3efc1f;});})[_0x192c9c(0xcc)](_0x1327e9=>{const _0x5dc2b1=_0x192c9c,_0x5e0d61=_0x1327e9['code'];_0x5e0d61==='auth/email-already-in-use'?(document['getElementById'](_0x5dc2b1(0xbb))[_0x5dc2b1(0xc6)][_0x5dc2b1(0xce)]=_0x5dc2b1(0xd3),document[_0x5dc2b1(0x9e)](_0x5dc2b1(0xbb))[_0x5dc2b1(0xc6)]['color']='red'):(document['getElementById'](_0x5dc2b1(0xbb))[_0x5dc2b1(0xc6)][_0x5dc2b1(0xce)]=_0x5dc2b1(0xd1),document[_0x5dc2b1(0x9e)](_0x5dc2b1(0xbb))[_0x5dc2b1(0xc6)][_0x5dc2b1(0x9f)]=_0x5dc2b1(0xae));return;});}