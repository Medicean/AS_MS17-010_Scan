/**
 * 插件UI框架
 */

const WIN = require('ui/window');
const LANG = require('../language/');
const SubnetCIDRAdviser = require( 'subnet-cidr-calculator' );

class UI {
  constructor(opt) {
    // 创建一个windows窗口
    this.win = new WIN({
      title: `${LANG['title']} - ${opt['url']}`,
      height: 444,
      width: 520,
    });
    this.createMainLayout();
    return {
      onScan: (func) => {
        this.bindToolbarClickHandler(func);
      },
      onAbout: () => {}
    }
  }

  /**
   * 创建上下layout:扫描输入&&扫描结果
   * @return {[type]} [description]
   */
  createMainLayout() {
    let layout = this.win.win.attachLayout('2E');
    // 扫描输入
    layout.cells('a').hideHeader();
    layout.cells('a').setText(`<i class="fa fa-cogs"></i> ${LANG['cella']['title']}`);
    // 扫描结果
    layout.cells('b').setText(`<i class="fa fa-bars"></i> ${LANG['cellb']['title']}`);
    layout.cells('b').collapse();

    // 创建toolbar
    this.createToolbar(layout.cells('a'));
    // 创建form
    this.createForm(layout.cells('a'));
    // 创建grid
    this.createGrid(layout.cells('b'));

    this.layout = layout;
  }

  /**
   * 创建扫描输入工具栏
   * @param  {Object} cell [description]
   * @return {[type]}      [description]
   */
  createToolbar(cell) {
    let toolbar = cell.attachToolbar();
    toolbar.loadStruct([
      { id: 'start', type: 'button', text: LANG['cella']['start'], icon: 'play' }
    ]);
    this.toolbar = toolbar;
  }

  /**
   * 创建扫描输入表单
   * @param  {Object} cell [description]
   * @return {[type]}      [description]
   */
  createForm(cell) {
    let formdata=[{
        type: 'settings', position: 'label-left',
        labelWidth: 150, inputWidth: 200
      }, {
        type: 'block', inputWidth: 'auto',
        offsetTop: 12,
        list: [{
            type: 'input', label: LANG['cella']['form']['ip'], name: 'scanip',
            required: true, validate:"NotEmpty",
            value: '127.0.0.1/24'
          }, {
            type: 'input', label: LANG['cella']['form']['ports'], name: 'scanports',
            required: true,
            value: '445'
        }]
    }];
    let form = cell.attachForm(formdata, true);
    form.enableLiveValidation(true);
    this.form = form;
  }

  /**
   * 创建扫描结果表格
   * @param  {Object} cell [description]
   * @return {[type]}      [description]
   */
  createGrid(cell) {
    let grid = cell.attachGrid();
    grid.setHeader(`
      ${LANG['cellb']['grid']['ip']},
      ${LANG['cellb']['grid']['port']},
      ${LANG['cellb']['grid']['status']}
    `);
    grid.setColTypes("ro,ro,ro");
    grid.setColSorting('str,int,str');
    grid.setInitWidths("150,100,*");
    grid.setColAlign("left,left,center");
    grid.enableMultiselect(true);
    grid.init();

    this.grid = grid;
  }

  /**
   * 监听开始按钮点击事件
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  bindToolbarClickHandler(callback) {
    let _this = this;
    this.toolbar.attachEvent('onClick', (id) => {
      switch (id) {
        case 'start':
          // 开始扫描
          // 加载中
          _this.layout.cells('a').progressOn();
          _this.grid.clearAll();
          // 获取FORM表单
          let formvals = this.form.getValues();
          let ipList = [];
          let subnetdetails = SubnetCIDRAdviser.getSubnetDetails(formvals['scanip']);
          if(subnetdetails.hosts.length == 0) {
            ipList = subnetdetails.startAddr || formvals['scanip'];
          } else {
            ipList = subnetdetails.hosts;
          }
          console.log(ipList);
          _this.layout.cells('a').collapse();
          _this.layout.cells('b').expand();
          let griddata = [];
          const CheckVuln = (_ip) => {
            new Promise((res, rej) => {
              let ip = _ip.shift();
              if (ip) {
                res(ip);
              } else {
                // 扫描完毕
                toastr.success(LANG['success'], antSword['language']['toastr']['success']);
                _this.grid.clearAll();
                _this.grid.parse({
                  rows: griddata,
                }, 'json');
                // 取消锁定LOADING
                _this.layout.cells('a').progressOff();
              }
            }).then((ip) => {
              callback({
                ip: ip,
                ports: formvals['scanports']
              }).then((ret) => {
                // 解析扫描结果
                ret.text.split('\n').map((item, i) => {
                  if (!item) {return};
                  item = antSword.noxss(item);
                  griddata.push({
                    id: item.split('\t')[0],
                    style: item.indexOf('Vuln') > -1 ? "background-color:#ADF1B9": "",
                    data: item.split('\t')
                  });
                });
                // 渲染UI
                _this.grid.clearAll();
                _this.grid.parse({
                  rows: griddata,
                }, 'json');
                return CheckVuln(_ip);
              }).catch((err) => {
                toastr.error(LANG['error'], antSword['language']['toastr']['error']);
                return CheckVuln(_ip);
              });
            });
          };
          CheckVuln(ipList);
          break;
        default:
      }
    })
  }
}

module.exports = UI;
