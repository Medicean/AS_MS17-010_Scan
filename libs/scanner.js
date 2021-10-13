/**
 * 核心扫描模块
 */

class Scanner {
  constructor(opt, argv) {
    return new Promise((res, rej) => {
      // 初始化核心模块
      let core = new antSword['core'][opt['type']](opt);
      // 请求数据
      let code = {};
      if (opt['type'] === 'jsp') {
        //
      } else {
        code = {
          _: this.template[opt['type']](argv.ip, argv.ports)
        }
      }
      core.request(code).then(res)
      .catch((err)=>{return rej(err);});
    })
  }

  /**
   * 扫描代码函数
   * @return {[type]}      [description]
   */
  get template() {
    let that = this;
    let php17010 = `function ms17010($host,$port){
$tcp='tcp://'.$host.':'.$port;
$sock=stream_socket_client($tcp,$errno, $errstr, 3,STREAM_CLIENT_CONNECT);
if ($sock){
  $data1=pack('H*','00000054ff534d42720000000018012800000000000000000000000000002f4b0000c55e003100024c414e4d414e312e3000024c4d312e325830303200024e54204c414e4d414e20312e3000024e54204c4d20302e313200');
  fwrite($sock,$data1);
  fread($sock, 1024);
  $data2=pack('H*','00000063ff534d42730000000018012000000000000000000000000000002f4b0000c55e0dff000000dfff02000100000000000000000000000000400000002600002e0057696e646f7773203230303020323139350057696e646f7773203230303020352e3000');
  fwrite($sock,$data2);
  $data2_data=fread($sock, 1024);
  $user_id=substr(bin2hex($data2_data),64,4);
  $data3=pack('H*','000000'.dechex(58+strlen($host)).'ff534d42750000000018012000000000000000000000000000002f4b'.$user_id.'c55e04ff000000000001001a00005c5c'.bin2hex($host).'5c49504324003f3f3f3f3f00');
  fwrite($sock,$data3);
  $data3_data=fread($sock, 1024);
  $allid=substr(bin2hex($data3_data),28*2,16);
  $data4=pack('H*','0000004aff534d422500000000180128000000000000000000000000'.$allid.'1000000000ffffffff0000000000000000000000004a0000004a0002002300000007005c504950455c00');
  fwrite($sock,$data4);
  $data4_data=fread($sock, 1024);
  if(substr(bin2hex($data4_data),18,8) == '050200c0'){
    return true;
  }else{
    return false;
  }
}
};`;
    let codes = {
      php4: (ip, ports) => `
${php17010}
if(ms17010("${ip}","${ports}")){
  echo "${ip}\\t${ports}\\tVulnerable\\n";
}else{
  echo "${ip}\\t${ports}\\tNo\\n";
};`.replace(/\n\s+/g, ''),
      php: (ip, ports) => `
${php17010}
try{
  if(ms17010("${ip}","${ports}")) {
    echo "${ip}\\t${ports}\\tVulnerable\\n";
  }else{
    echo "${ip}\\t${ports}\\tNo\\n";
  };
}catch(Exception $e) {
  echo "${ip}\\t${ports}\\t".$e->getMessage()."\\n";
}
`.replace(/\n\s+/g, ''),
      asp: (ip, ports) => ``,
      aspx: (ip, ports) => ``
    }
    codes['phpraw'] = codes['php'];
    return codes;
  }
}

module.exports = Scanner;
