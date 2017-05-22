var React = require('react');
var Link = require('react-router').Link;
var AccessModal = require('./partials/AccessModal');
var ProfileStore = require('./../../stores/ProfileStore');
var UserActions = require('./../../actions/UserActions');

var PublicFiles = React.createClass({
  getInitialState: function(){
    return({showAccess:false,
            contacts: ProfileStore.getData().contacts,
            groups: ProfileStore.getData().groups});
  },
  closeModal: function(){
    this.setState({showAccess:false})
  },
  updateData: function(){
    this.setState({
      contacts: ProfileStore.getData().contacts,
      groups: ProfileStore.getData().groups
    })
  },
    reloadData:function(){
    this.state.filemanager.clearAll();
    this.state.filemanager.load("/public_files");

},
  componentDidMount: function() {
    this.unsubscribe = ProfileStore.listen(this.updateData);
      this.unsubscribe2 = UserActions.reloadData.listen(this.reloadData);
      webix.i18n.filemanager = {
          name: "Название",
          size: "Размер",
          type: "Тип",
          date: "Дата",
          copy: "Копировать",
          cut: "Вырезать",
          paste: "Вставить",
          upload: "Загрузить",
          remove: "Удалить",
          create: "Создать папку",
          rename: "Переименовать",
          location: "Положение",
          select: "Выбрать файлы",
          sizeLabels: ["B", "KB", "MB", "GB"],
          saving: "Сохранение...",
          errorResponse: "Ошибка: изменения не сохранены!",
          replaceConfirmation: "Вы действительно хотите заменить существующие файлы?",
          createConfirmation: "Папка уже существует. Вы действительно хотите ее заменить?",
          renameConfirmation: "Файл уже существует. Вы действительно хотите его заменить?",
          yes: "Да",
          no: "Нет",
          types: {
              folder: "Folder",
              doc: "Document",
              excel: "Excel",
              pdf: "PDF",
              pp: "PowerPoint",
              text: "Text File",
              video: "Video File",
              image: "Image",
              code: "Code",
              audio: "Audio",
              archive: "Archive",
              file: "File"
          }
      };
      document.body.className = " webix_full_screen";
    var _this = this;
      setTimeout(function() {
          var manager = webix.ui({
              view: "filemanager",
              id: "files",
              disabledHistory: true,
              handlers: {
                  "upload": "/public_files/save",
                  "copy": "/public_files/update",
                  "move": "/public_files/update",
                  "remove": "/public_files/delete",
                  "rename": "/public_files/update",
                  "create": "/public_files/save",
                  "branch": "/public_files/branch",
                  "paste": "/public_files/branch",
                  "search": "/public_files/search"
              }
          });
          $$('files').load("/public_files");
          var actions = $$("files").getMenu();
          _this.setState({filemanager:manager});
          actions.add({
              id: "show",
              icon: "eye",
              value: "Показать"
          });
          actions.add({
              id: "download",
              icon: "download",
              value: "Скачать"
          });
          actions.attachEvent("onItemClick", function(id) {

               if (id == "download") {
                  var active = manager.getItem(manager.getActive());
                  $('body').append($("<a class='deleteMe' href='files/userfiles/"+active.id+"' target='_blank' download></a>"));
                  $('.deleteMe')[0].click();
                  $('.deleteMe').remove();

              }
              if (id == "show") {
                  var item = manager.getItem(manager.getActive());
                  var id = item.id;
                  if (["folder"].indexOf(item.type) == -1) {
                      var content, cb;
                      var size = {
                          w: 600,
                          h: 600
                      };

                      switch (item.type) {
                          case 'image':
                              size = {
                                  w: "auto",
                                  h: "auto"
                              };
                              content = "<img src='/public_files/userfiles/" + id + "'/>";
                              break;
                          case 'pdf':
                              content = '<iframe src = "/ViewerJS/#../public_files/userfiles/' + id + '.pdf" width="600" height="600" allowfullscreen webkitallowfullscreen></iframe>';
                              break;
                          case 'video':
                              size = {
                                  w: "auto",
                                  h: "auto"
                              };
                              content = '<div id="video_div" style="width:100%; height:100%;"></div>';
                              cb = webix.ui.bind(null, {
                                  view: "video",
                                  id: "video1", //used to work with the component later
                                  container: "video_div",
                                  src: ['/public_files/userfiles/' + id]
                              });
                              break;
                          case 'excel':
                              size = {
                                  w: "auto",
                                  h: "100%"
                              };
                              content = '<div id="excel_div" style="width:100%; height:100%;"></div>';
                              cb = webix.ui.bind(null,{
                                  view:"excelviewer",
                                  container:"excel_div",
                                  excelHeader:true,
                                  url:"public_files/userfiles/"+ id
                              });
                              break;

                      }
                      if (content) {
                          webix.ui({
                              view: "popup",
                              id: "my_popup",
                              head: "My Window",
                              position: "center",
                              width: size.w,
                              height: size.h,
                              body: {
                                  template: content
                              }
                          }).show();
                      }
                      if (cb) {
                          cb();
                      }

                  }
                  return true;
              }
          });
          manager.getUploader().attachEvent("onBeforeFileAdd", function(par1, par2, par3, par4) {
              debugger;
          });

          $$("files").attachEvent("onItemDblClick", function(id) {
              id = this.getItem(id).year;
              log("onItemDblClick", id);
              return false;
          });

      }, 200);

  },
  componentWillUnmount: function() {
      $('.webix_view').remove();
      document.body.className = "";
    this.unsubscribe();
  },
  render: function() {

      return (
        <div>
          < div id = "files" > </div>
        </div>
      );
      }
  });
module.exports = PublicFiles;
