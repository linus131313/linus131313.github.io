const _0x210127=_0x24b0;function _0x24b0(_0x380e9d,_0x3cde9f){const _0x1cdf4f=_0x1cdf();return _0x24b0=function(_0x24b0c2,_0x2dee64){_0x24b0c2=_0x24b0c2-0x15a;let _0x344d61=_0x1cdf4f[_0x24b0c2];return _0x344d61;},_0x24b0(_0x380e9d,_0x3cde9f);}(function(_0x225a2c,_0x187674){const _0x95b735=_0x24b0,_0x5a20eb=_0x225a2c();while(!![]){try{const _0x245796=-parseInt(_0x95b735(0x15d))/0x1+parseInt(_0x95b735(0x180))/0x2*(parseInt(_0x95b735(0x16f))/0x3)+parseInt(_0x95b735(0x184))/0x4+parseInt(_0x95b735(0x16a))/0x5*(-parseInt(_0x95b735(0x16c))/0x6)+parseInt(_0x95b735(0x168))/0x7*(-parseInt(_0x95b735(0x162))/0x8)+parseInt(_0x95b735(0x15c))/0x9*(-parseInt(_0x95b735(0x187))/0xa)+parseInt(_0x95b735(0x17a))/0xb;if(_0x245796===_0x187674)break;else _0x5a20eb['push'](_0x5a20eb['shift']());}catch(_0x5265b7){_0x5a20eb['push'](_0x5a20eb['shift']());}}}(_0x1cdf,0xc3f08),document[_0x210127(0x17e)](_0x210127(0x177))['style'][_0x210127(0x175)]='none');import{initializeApp}from'https://www.gstatic.com/firebasejs/9.4.1/firebase-app.js';import{getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut,onAuthStateChanged}from'https://www.gstatic.com/firebasejs/9.4.1/firebase-auth.js';import{getFirestore,collection,doc,setDoc,getDocs}from'https://www.gstatic.com/firebasejs/9.4.1/firebase-firestore.js';const firebaseConfig={'apiKey':_0x210127(0x173),'authDomain':_0x210127(0x188),'projectId':_0x210127(0x15a),'storageBucket':_0x210127(0x182),'messagingSenderId':_0x210127(0x15e),'appId':_0x210127(0x170)},app=initializeApp(firebaseConfig),auth=getAuth(app),db=getFirestore(app);let signInForm=document[_0x210127(0x17e)](_0x210127(0x179));function _0x1cdf(){const _0x314871=['signin-password','none','399shKDKf','1:945052022593:web:e6889785d166df5e0653c0','then','innerHTML','AIzaSyBWhH4qYxVx2NWYUNnkY7rfviGEelwg7oQ','code','display','forEach','errorMessage','data','wf-form-signin-form','36193278MXaKvd','value','submit','catch','getElementById','addEventListener','9316GSbbPO','preventDefault','haushelper-12f14.appspot.com','uid','2228752uSHPlZ','querySelectorAll','stopPropagation','481190oUgWGY','haushelper-12f14.firebaseapp.com','haushelper-12f14','[data-onlogin=\x27hide\x27]','63dZMnlO','1452414nxTmpQ','945052022593','/adminroom','signin-email','initial','3874616Sfkgct','email','location','message','style','block','14fEJipR','signin-error-message','4532655bxvRJj','href','6ROVudW'];_0x1cdf=function(){return _0x314871;};return _0x1cdf();}if(typeof signInForm!==null)signInForm[_0x210127(0x17f)](_0x210127(0x17c),handleSignIn,!![]);else{}function handleSignIn(_0x3f8925){const _0xa56aa=_0x210127;_0x3f8925[_0xa56aa(0x181)](),_0x3f8925[_0xa56aa(0x186)]();const _0x425a24=document[_0xa56aa(0x17e)](_0xa56aa(0x160))[_0xa56aa(0x17b)],_0x83a4f6=document[_0xa56aa(0x17e)](_0xa56aa(0x16d))[_0xa56aa(0x17b)];signInWithEmailAndPassword(auth,_0x425a24,_0x83a4f6)[_0xa56aa(0x171)](_0x2ea661=>{const _0x21843e=_0xa56aa,_0x1ce602=_0x2ea661['user'],_0x5e63fd=collection(db,'Admins');var _0x24ce93=![];getDocs(_0x5e63fd)['then'](_0x2f85d1=>{const _0x120fc2=_0x24b0;_0x2f85d1[_0x120fc2(0x176)](_0x59ed3f=>{const _0x191aa0=_0x120fc2;if(_0x59ed3f[_0x191aa0(0x178)]()[_0x191aa0(0x163)]===_0x425a24)_0x24ce93=!![],window[_0x191aa0(0x164)][_0x191aa0(0x16b)]=_0x191aa0(0x15f);else{}}),!_0x24ce93&&(document[_0x120fc2(0x17e)](_0x120fc2(0x177))[_0x120fc2(0x166)][_0x120fc2(0x175)]=_0x120fc2(0x167),handleSignOut());})[_0x21843e(0x17d)](_0x55a790=>{});})['catch'](_0x1e8750=>{const _0x47757a=_0xa56aa;document['getElementById'](_0x47757a(0x177))[_0x47757a(0x166)][_0x47757a(0x175)]=_0x47757a(0x167);const _0x65d8d9=_0x1e8750[_0x47757a(0x174)],_0x87443e=_0x1e8750[_0x47757a(0x165)];var _0x250e48=document['getElementById'](_0x47757a(0x169));_0x250e48[_0x47757a(0x172)]=_0x87443e;});}function handleSignOut(){const _0x2ad043=_0x210127;signOut(auth)[_0x2ad043(0x171)](()=>{})[_0x2ad043(0x17d)](_0x1ad3fa=>{const _0x3806f8=_0x1ad3fa['message'];});}onAuthStateChanged(auth,_0x42e3b1=>{const _0x1e82f2=_0x210127;let _0x3a4857=document['querySelectorAll'](_0x1e82f2(0x15b)),_0x417b4a=document[_0x1e82f2(0x185)]('[data-onlogin=\x27show\x27]');if(_0x42e3b1){const _0x19c68d=_0x42e3b1[_0x1e82f2(0x183)];_0x417b4a[_0x1e82f2(0x176)](function(_0x28ffd2){const _0x2e6d84=_0x1e82f2;_0x28ffd2['style'][_0x2e6d84(0x175)]='initial';}),_0x3a4857['forEach'](function(_0x234070){const _0x5b3428=_0x1e82f2;_0x234070[_0x5b3428(0x166)][_0x5b3428(0x175)]=_0x5b3428(0x16e);});}else _0x3a4857['forEach'](function(_0x4a328a){const _0x301033=_0x1e82f2;_0x4a328a['style']['display']=_0x301033(0x161);}),_0x417b4a[_0x1e82f2(0x176)](function(_0xfec233){const _0x3193c7=_0x1e82f2;_0xfec233[_0x3193c7(0x166)][_0x3193c7(0x175)]='none';});});