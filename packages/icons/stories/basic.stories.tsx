import React from 'react'
import * as Icons from '../src'

/**
 * @title 基础用法
 */
export const Basic = () => {
  // import * as Icons from '@hi-ui/icons'
  const iconGroups = React.useMemo(() => {
    return [
      {
        id: 'alert',
        title: '提示',
        children: [
          {
            id: 'filled',
            title: '面型',
            children: [
              { component: Icons.CheckCircleFilled, tagName: 'CheckCircleFilled' },

              { component: Icons.CheckSquareFilled, tagName: 'CheckSquareFilled' },

              { component: Icons.CloseCircleFilled, tagName: 'CloseCircleFilled' },

              { component: Icons.MinusSquareFilled, tagName: 'MinusSquareFilled' },

              { component: Icons.ExclamationCircleFilled, tagName: 'ExclamationCircleFilled' },

              { component: Icons.InfoCircleFilled, tagName: 'InfoCircleFilled' },

              { component: Icons.QuestionCircleFilled, tagName: 'QuestionCircleFilled' },

              { component: Icons.StopFilled, tagName: 'StopFilled' },

              { component: Icons.WarningFilled, tagName: 'WarningFilled' },
            ],
          },
          {
            id: 'outlined',
            title: '线型',
            children: [
              { component: Icons.CheckOutlined, tagName: 'CheckOutlined' },

              { component: Icons.CheckCircleOutlined, tagName: 'CheckCircleOutlined' },

              { component: Icons.CheckSquareOutlined, tagName: 'CheckSquareOutlined' },

              { component: Icons.CloseOutlined, tagName: 'CloseOutlined' },

              { component: Icons.CloseCircleOutlined, tagName: 'CloseCircleOutlined' },

              { component: Icons.CloseSquareOutlined, tagName: 'CloseSquareOutlined' },

              { component: Icons.ExclamationOutlined, tagName: 'ExclamationOutlined' },

              { component: Icons.ExclamationCircleOutlined, tagName: 'ExclamationCircleOutlined' },

              { component: Icons.InfoOutlined, tagName: 'InfoOutlined' },

              { component: Icons.InfoCircleOutlined, tagName: 'InfoCircleOutlined' },

              { component: Icons.MinusOutlined, tagName: 'MinusOutlined' },

              { component: Icons.MinusSquareOutlined, tagName: 'MinusSquareOutlined' },

              { component: Icons.PlusOutlined, tagName: 'PlusOutlined' },

              { component: Icons.PlusSquareOutlined, tagName: 'PlusSquareOutlined' },

              { component: Icons.QuestionOutlined, tagName: 'QuestionOutlined' },

              { component: Icons.QuestionCircleOutlined, tagName: 'QuestionCircleOutlined' },

              { component: Icons.StopOutlined, tagName: 'StopOutlined' },

              { component: Icons.WarningOutlined, tagName: 'WarningOutlined' },
            ],
          },
        ],
      },
      {
        id: 'common',
        title: '通用',
        children: [
          {
            id: 'filled',
            title: '面型',
            children: [
              { component: Icons.AlarmFilled, tagName: 'AlarmFilled' },

              { component: Icons.AlarmClockFilled, tagName: 'AlarmClockFilled' },

              { component: Icons.AppStoreFilled, tagName: 'AppStoreFilled' },

              { component: Icons.ApproveFilled, tagName: 'ApproveFilled' },

              { component: Icons.ArchiveFilled, tagName: 'ArchiveFilled' },

              { component: Icons.AssetMonitorFilled, tagName: 'AssetMonitorFilled' },

              { component: Icons.AudioFilled, tagName: 'AudioFilled' },

              { component: Icons.BankCardFilled, tagName: 'BankCardFilled' },

              { component: Icons.BellFilled, tagName: 'BellFilled' },

              { component: Icons.BlockFilled, tagName: 'BlockFilled' },

              { component: Icons.BookmarkFilled, tagName: 'BookmarkFilled' },

              { component: Icons.BuildingFilled, tagName: 'BuildingFilled' },

              { component: Icons.BulbFilled, tagName: 'BulbFilled' },

              { component: Icons.CalculatorFilled, tagName: 'CalculatorFilled' },

              { component: Icons.CalendarFilled, tagName: 'CalendarFilled' },

              { component: Icons.CameraFilled, tagName: 'CameraFilled' },

              { component: Icons.CertificateFilled, tagName: 'CertificateFilled' },

              { component: Icons.ChatFilled, tagName: 'ChatFilled' },

              { component: Icons.CloudFilled, tagName: 'CloudFilled' },

              { component: Icons.CloudDownloadFilled, tagName: 'CloudDownloadFilled' },

              { component: Icons.CloudUploadFilled, tagName: 'CloudUploadFilled' },

              { component: Icons.CollectionFilled, tagName: 'CollectionFilled' },

              { component: Icons.DataMonitorFilled, tagName: 'DataMonitorFilled' },

              { component: Icons.DislikeFilled, tagName: 'DislikeFilled' },

              { component: Icons.DocumentFilled, tagName: 'DocumentFilled' },

              { component: Icons.DocumentExclamationFilled, tagName: 'DocumentExclamationFilled' },

              { component: Icons.EndDateFilled, tagName: 'EndDateFilled' },

              { component: Icons.ExpressionFilled, tagName: 'ExpressionFilled' },

              { component: Icons.FileFilled, tagName: 'FileFilled' },

              { component: Icons.FireFilled, tagName: 'FireFilled' },

              { component: Icons.FlagFilled, tagName: 'FlagFilled' },

              { component: Icons.FolderFilled, tagName: 'FolderFilled' },

              { component: Icons.FolderOpenFilled, tagName: 'FolderOpenFilled' },

              { component: Icons.HeartFilled, tagName: 'HeartFilled' },

              { component: Icons.HomeFilled, tagName: 'HomeFilled' },

              { component: Icons.KeyFilled, tagName: 'KeyFilled' },

              { component: Icons.LightningFilled, tagName: 'LightningFilled' },

              { component: Icons.LikeFilled, tagName: 'LikeFilled' },

              { component: Icons.LocationFilled, tagName: 'LocationFilled' },

              { component: Icons.LockFilled, tagName: 'LockFilled' },

              { component: Icons.MailFilled, tagName: 'MailFilled' },

              { component: Icons.MailOpenFilled, tagName: 'MailOpenFilled' },

              { component: Icons.MailSendFilled, tagName: 'MailSendFilled' },

              { component: Icons.ManFilled, tagName: 'ManFilled' },

              { component: Icons.MessageFilled, tagName: 'MessageFilled' },

              { component: Icons.MobileFilled, tagName: 'MobileFilled' },

              { component: Icons.MonitorFilled, tagName: 'MonitorFilled' },

              { component: Icons.MoonFilled, tagName: 'MoonFilled' },

              { component: Icons.PadFilled, tagName: 'PadFilled' },

              { component: Icons.PauseFilled, tagName: 'PauseFilled' },

              { component: Icons.PhoneFilled, tagName: 'PhoneFilled' },

              { component: Icons.PictureFilled, tagName: 'PictureFilled' },

              { component: Icons.PinFilled, tagName: 'PinFilled' },

              { component: Icons.PlayFilled, tagName: 'PlayFilled' },

              { component: Icons.PrinterFilled, tagName: 'PrinterFilled' },

              { component: Icons.QrCodeFilled, tagName: 'QrCodeFilled' },

              { component: Icons.RelationFilled, tagName: 'RelationFilled' },

              { component: Icons.RmbFilled, tagName: 'RmbFilled' },

              { component: Icons.SadFilled, tagName: 'SadFilled' },

              { component: Icons.SettingFilled, tagName: 'SettingFilled' },

              { component: Icons.ShoppingFilled, tagName: 'ShoppingFilled' },

              { component: Icons.SkinFilled, tagName: 'SkinFilled' },

              { component: Icons.SoundFilled, tagName: 'SoundFilled' },

              { component: Icons.StarFilled, tagName: 'StarFilled' },

              { component: Icons.StartDateFilled, tagName: 'StartDateFilled' },

              { component: Icons.StudentFilled, tagName: 'StudentFilled' },

              { component: Icons.SunFilled, tagName: 'SunFilled' },

              { component: Icons.TagFilled, tagName: 'TagFilled' },

              { component: Icons.TaskFilled, tagName: 'TaskFilled' },

              { component: Icons.TemplateFilled, tagName: 'TemplateFilled' },

              { component: Icons.TimeFilled, tagName: 'TimeFilled' },

              { component: Icons.ToolFilled, tagName: 'ToolFilled' },

              { component: Icons.TravelFilled, tagName: 'TravelFilled' },

              { component: Icons.TruckFilled, tagName: 'TruckFilled' },

              { component: Icons.UmbrellaFilled, tagName: 'UmbrellaFilled' },

              { component: Icons.UnlockFilled, tagName: 'UnlockFilled' },

              { component: Icons.UpdateFilled, tagName: 'UpdateFilled' },

              { component: Icons.UserFilled, tagName: 'UserFilled' },

              { component: Icons.VideoCameraFilled, tagName: 'VideoCameraFilled' },

              { component: Icons.WebpageFilled, tagName: 'WebpageFilled' },
            ],
          },
          {
            id: 'outlined',
            title: '线型',
            children: [
              { component: Icons.AlarmOutlined, tagName: 'AlarmOutlined' },

              { component: Icons.AlarmClockOutlined, tagName: 'AlarmClockOutlined' },

              { component: Icons.AppStoreOutlined, tagName: 'AppStoreOutlined' },

              { component: Icons.ApproveOutlined, tagName: 'ApproveOutlined' },

              { component: Icons.ArchiveOutlined, tagName: 'ArchiveOutlined' },

              { component: Icons.AssetMonitorOutlined, tagName: 'AssetMonitorOutlined' },

              { component: Icons.AudioOutlined, tagName: 'AudioOutlined' },

              { component: Icons.BankCardOutlined, tagName: 'BankCardOutlined' },

              { component: Icons.BarsOutlined, tagName: 'BarsOutlined' },

              { component: Icons.BellOutlined, tagName: 'BellOutlined' },

              { component: Icons.BlockOutlined, tagName: 'BlockOutlined' },

              { component: Icons.BookmarkOutlined, tagName: 'BookmarkOutlined' },

              { component: Icons.BuildingOutlined, tagName: 'BuildingOutlined' },

              { component: Icons.BulbOutlined, tagName: 'BulbOutlined' },

              {
                component: Icons.BusinessCardTransverseOutlined,
                tagName: 'BusinessCardTransverseOutlined',
              },

              { component: Icons.BusinessCardOutlined, tagName: 'BusinessCardOutlined' },

              { component: Icons.CalculatorOutlined, tagName: 'CalculatorOutlined' },

              { component: Icons.CalendarOutlined, tagName: 'CalendarOutlined' },

              { component: Icons.CameraOutlined, tagName: 'CameraOutlined' },

              { component: Icons.ChatOutlined, tagName: 'ChatOutlined' },

              { component: Icons.ClockOutlined, tagName: 'ClockOutlined' },

              { component: Icons.CloseCodeOutlined, tagName: 'CloseCodeOutlined' },

              { component: Icons.CloudOutlined, tagName: 'CloudOutlined' },

              { component: Icons.CloudDownloadOutlined, tagName: 'CloudDownloadOutlined' },

              { component: Icons.CloudUploadOutlined, tagName: 'CloudUploadOutlined' },

              { component: Icons.CollectionOutlined, tagName: 'CollectionOutlined' },

              { component: Icons.DataMonitorOutlined, tagName: 'DataMonitorOutlined' },

              { component: Icons.DiagramOutlined, tagName: 'DiagramOutlined' },

              { component: Icons.DislikeOutlined, tagName: 'DislikeOutlined' },

              { component: Icons.DocumentOutlined, tagName: 'DocumentOutlined' },

              {
                component: Icons.DocumentExclamationOutlined,
                tagName: 'DocumentExclamationOutlined',
              },

              { component: Icons.DownloadOutlined, tagName: 'DownloadOutlined' },

              { component: Icons.EndDateOutlined, tagName: 'EndDateOutlined' },

              { component: Icons.ExportOutlined, tagName: 'ExportOutlined' },

              { component: Icons.ExpressionOutlined, tagName: 'ExpressionOutlined' },

              { component: Icons.EyeOutlined, tagName: 'EyeOutlined' },

              { component: Icons.EyeInvisibleOutlined, tagName: 'EyeInvisibleOutlined' },

              { component: Icons.FileOutlined, tagName: 'FileOutlined' },

              { component: Icons.FileExcelOutlined, tagName: 'FileExcelOutlined' },

              { component: Icons.FileExeOutlined, tagName: 'FileExeOutlined' },

              { component: Icons.FileJpgOutlined, tagName: 'FileJpgOutlined' },

              { component: Icons.FileKeynoteOutlined, tagName: 'FileKeynoteOutlined' },

              { component: Icons.FileMusicOutlined, tagName: 'FileMusicOutlined' },

              { component: Icons.FilePdfOutlined, tagName: 'FilePdfOutlined' },

              { component: Icons.FilePptOutlined, tagName: 'FilePptOutlined' },

              { component: Icons.FileQuestionOutlined, tagName: 'FileQuestionOutlined' },

              { component: Icons.FileTxtOutlined, tagName: 'FileTxtOutlined' },

              { component: Icons.FileVideoOutlined, tagName: 'FileVideoOutlined' },

              { component: Icons.FileWordOutlined, tagName: 'FileWordOutlined' },

              { component: Icons.FileZipOutlined, tagName: 'FileZipOutlined' },

              { component: Icons.FireOutlined, tagName: 'FireOutlined' },

              { component: Icons.FlagOutlined, tagName: 'FlagOutlined' },

              { component: Icons.FolderOutlined, tagName: 'FolderOutlined' },

              { component: Icons.FolderOpenOutlined, tagName: 'FolderOpenOutlined' },

              { component: Icons.GlobalOutlined, tagName: 'GlobalOutlined' },

              { component: Icons.HeartOutlined, tagName: 'HeartOutlined' },

              { component: Icons.HomeOutlined, tagName: 'HomeOutlined' },

              { component: Icons.ImportOutlined, tagName: 'ImportOutlined' },

              { component: Icons.KeyOutlined, tagName: 'KeyOutlined' },

              { component: Icons.LightningOutlined, tagName: 'LightningOutlined' },

              { component: Icons.LikeOutlined, tagName: 'LikeOutlined' },

              { component: Icons.LinkOutlined, tagName: 'LinkOutlined' },

              { component: Icons.LocationOutlined, tagName: 'LocationOutlined' },

              { component: Icons.LockOutlined, tagName: 'LockOutlined' },

              { component: Icons.MailOutlined, tagName: 'MailOutlined' },

              { component: Icons.MailOpenOutlined, tagName: 'MailOpenOutlined' },

              { component: Icons.MailSendOutlined, tagName: 'MailSendOutlined' },

              { component: Icons.ManOutlined, tagName: 'ManOutlined' },

              { component: Icons.MenuOutlined, tagName: 'MenuOutlined' },

              { component: Icons.MessageOutlined, tagName: 'MessageOutlined' },

              { component: Icons.MobileOutlined, tagName: 'MobileOutlined' },

              { component: Icons.MonitorOutlined, tagName: 'MonitorOutlined' },

              { component: Icons.MoonOutlined, tagName: 'MoonOutlined' },

              { component: Icons.MoveOutlined, tagName: 'MoveOutlined' },

              { component: Icons.PadOutlined, tagName: 'PadOutlined' },

              { component: Icons.PauseOutlined, tagName: 'PauseOutlined' },

              { component: Icons.PhoneOutlined, tagName: 'PhoneOutlined' },

              { component: Icons.PictureOutlined, tagName: 'PictureOutlined' },

              { component: Icons.PinOutlined, tagName: 'PinOutlined' },

              { component: Icons.PlayOutlined, tagName: 'PlayOutlined' },

              { component: Icons.PowerOffOutlined, tagName: 'PowerOffOutlined' },

              { component: Icons.PrinterOutlined, tagName: 'PrinterOutlined' },

              { component: Icons.QrCodeOutlined, tagName: 'QrCodeOutlined' },

              { component: Icons.RelationOutlined, tagName: 'RelationOutlined' },

              { component: Icons.ResetOutlined, tagName: 'ResetOutlined' },

              { component: Icons.RmbOutlined, tagName: 'RmbOutlined' },

              { component: Icons.SadOutlined, tagName: 'SadOutlined' },

              { component: Icons.ScanOutlined, tagName: 'ScanOutlined' },

              { component: Icons.SearchOutlined, tagName: 'SearchOutlined' },

              { component: Icons.SendOutOutlined, tagName: 'SendOutOutlined' },

              { component: Icons.SettingOutlined, tagName: 'SettingOutlined' },

              { component: Icons.ShareOutlined, tagName: 'ShareOutlined' },

              { component: Icons.ShopOutlined, tagName: 'ShopOutlined' },

              { component: Icons.ShoppingOutlined, tagName: 'ShoppingOutlined' },

              { component: Icons.ShowCodeOutlined, tagName: 'ShowCodeOutlined' },

              { component: Icons.SkinOutlined, tagName: 'SkinOutlined' },

              { component: Icons.SoundOutlined, tagName: 'SoundOutlined' },

              { component: Icons.StarOutlined, tagName: 'StarOutlined' },

              { component: Icons.StartDateOutlined, tagName: 'StartDateOutlined' },

              { component: Icons.StudentOutlined, tagName: 'StudentOutlined' },

              { component: Icons.SunOutlined, tagName: 'SunOutlined' },

              { component: Icons.SynchronizeOutlined, tagName: 'SynchronizeOutlined' },

              { component: Icons.TagOutlined, tagName: 'TagOutlined' },

              { component: Icons.TaskOutlined, tagName: 'TaskOutlined' },

              { component: Icons.TemplateOutlined, tagName: 'TemplateOutlined' },

              { component: Icons.TimeOutlined, tagName: 'TimeOutlined' },

              { component: Icons.TimeRewindOutlined, tagName: 'TimeRewindOutlined' },

              { component: Icons.ToolOutlined, tagName: 'ToolOutlined' },

              { component: Icons.TravelOutlined, tagName: 'TravelOutlined' },

              { component: Icons.TruckOutlined, tagName: 'TruckOutlined' },

              { component: Icons.UmberOutlined, tagName: 'UmberOutlined' },

              { component: Icons.UmbrellaOutlined, tagName: 'UmbrellaOutlined' },

              { component: Icons.UnlockOutlined, tagName: 'UnlockOutlined' },

              { component: Icons.UpdateOutlined, tagName: 'UpdateOutlined' },

              { component: Icons.UploadOutlined, tagName: 'UploadOutlined' },

              { component: Icons.UserOutlined, tagName: 'UserOutlined' },

              { component: Icons.UserAddOutlined, tagName: 'UserAddOutlined' },

              { component: Icons.UsersOutlined, tagName: 'UsersOutlined' },

              { component: Icons.VideoCameraOutlined, tagName: 'VideoCameraOutlined' },

              { component: Icons.WebpageOutlined, tagName: 'WebpageOutlined' },

              { component: Icons.WomanOutlined, tagName: 'WomanOutlined' },
            ],
          },
        ],
      },
      {
        id: 'direction',
        title: '方向',
        children: [
          {
            id: 'filled',
            title: '面型',
            children: [
              { component: Icons.CaretDownFilled, tagName: 'CaretDownFilled' },

              { component: Icons.CaretLeftFilled, tagName: 'CaretLeftFilled' },

              { component: Icons.CaretRightFilled, tagName: 'CaretRightFilled' },

              { component: Icons.CaretUpFilled, tagName: 'CaretUpFilled' },
            ],
          },
          {
            id: 'outlined',
            title: '线型',
            children: [
              { component: Icons.ArrowDownOutlined, tagName: 'ArrowDownOutlined' },

              { component: Icons.ArrowLeftOutlined, tagName: 'ArrowLeftOutlined' },

              { component: Icons.ArrowRightOutlined, tagName: 'ArrowRightOutlined' },

              { component: Icons.ArrowUpOutlined, tagName: 'ArrowUpOutlined' },

              { component: Icons.DirectionDownOutlined, tagName: 'DirectionDownOutlined' },

              { component: Icons.DirectionLeftOutlined, tagName: 'DirectionLeftOutlined' },

              { component: Icons.DirectionRightOutlined, tagName: 'DirectionRightOutlined' },

              { component: Icons.DirectionUpOutlined, tagName: 'DirectionUpOutlined' },

              { component: Icons.DownOutlined, tagName: 'DownOutlined' },

              { component: Icons.ExpandOutlined, tagName: 'ExpandOutlined' },

              { component: Icons.FullscreenOutlined, tagName: 'FullscreenOutlined' },

              { component: Icons.FullscreenExitOutlined, tagName: 'FullscreenExitOutlined' },

              { component: Icons.LeftOutlined, tagName: 'LeftOutlined' },

              { component: Icons.LeftRightOutlined, tagName: 'LeftRightOutlined' },

              { component: Icons.MenuFoldOutlined, tagName: 'MenuFoldOutlined' },

              { component: Icons.MenuUnfoldOutlined, tagName: 'MenuUnfoldOutlined' },

              { component: Icons.RightOutlined, tagName: 'RightOutlined' },

              { component: Icons.ShrinkOutlined, tagName: 'ShrinkOutlined' },

              { component: Icons.ToBottomOutlined, tagName: 'ToBottomOutlined' },

              { component: Icons.ToTopOutlined, tagName: 'ToTopOutlined' },

              { component: Icons.UpOutlined, tagName: 'UpOutlined' },
            ],
          },
        ],
      },
      {
        id: 'edit',
        title: '编辑',
        children: [
          {
            id: 'filled',
            title: '面型',
            children: [
              { component: Icons.CopyFilled, tagName: 'CopyFilled' },
              { component: Icons.DeleteFilled, tagName: 'DeleteFilled' },
              { component: Icons.DetailsFilled, tagName: 'DetailsFilled' },
              { component: Icons.DuplicateFilled, tagName: 'DuplicateFilled' },
              { component: Icons.EditFilled, tagName: 'EditFilled' },
              { component: Icons.EllipsisCircleFilled, tagName: 'EllipsisCircleFilled' },
              { component: Icons.EmptyFilled, tagName: 'EmptyFilled' },
              { component: Icons.FilterFilled, tagName: 'FilterFilled' },
              { component: Icons.FolderAddFilled, tagName: 'FolderAddFilled' },
              { component: Icons.FolderMoveFilled, tagName: 'FolderMoveFilled' },
              { component: Icons.PasteFilled, tagName: 'PasteFilled' },
            ],
          },
          {
            id: 'outlined',
            title: '线型',
            children: [
              { component: Icons.AverageOutlined, tagName: 'AverageOutlined' },
              { component: Icons.ColumnHeightOutlined, tagName: 'ColumnHeightOutlined' },
              { component: Icons.ColumnsOutlined, tagName: 'ColumnsOutlined' },
              { component: Icons.CopyOutlined, tagName: 'CopyOutlined' },
              { component: Icons.DeleteOutlined, tagName: 'DeleteOutlined' },
              { component: Icons.DetailsOutlined, tagName: 'DetailsOutlined' },
              { component: Icons.DocumentSearchOutlined, tagName: 'DocumentSearchOutlined' },
              { component: Icons.DragOutlined, tagName: 'DragOutlined' },
              { component: Icons.DuplicateOutlined, tagName: 'DuplicateOutlined' },
              { component: Icons.EditOutlined, tagName: 'EditOutlined' },
              { component: Icons.EllipsisCircleOutlined, tagName: 'EllipsisCircleOutlined' },
              { component: Icons.EllipsisOutlined, tagName: 'EllipsisOutlined' },
              { component: Icons.EllipsisVerticalOutlined, tagName: 'EllipsisVerticalOutlined' },
              { component: Icons.EmptyOutlined, tagName: 'EmptyOutlined' },
              { component: Icons.EqualProportionOutlined, tagName: 'EqualProportionOutlined' },
              { component: Icons.FilterOutlined, tagName: 'FilterOutlined' },
              { component: Icons.FolderAddOutlined, tagName: 'FolderAddOutlined' },
              { component: Icons.FolderMoveOutlined, tagName: 'FolderMoveOutlined' },
              { component: Icons.FreezeColumnOutlined, tagName: 'FreezeColumnOutlined' },
              { component: Icons.FrozenLineOutlined, tagName: 'FrozenLineOutlined' },
              { component: Icons.PasteOutlined, tagName: 'PasteOutlined' },
              { component: Icons.RotateLeftOutlined, tagName: 'RotateLeftOutlined' },
              { component: Icons.RotateRightOutlined, tagName: 'RotateRightOutlined' },
              { component: Icons.SaveOutlined, tagName: 'SaveOutlined' },
              { component: Icons.ScissorOutlined, tagName: 'ScissorOutlined' },
              { component: Icons.SortAscendingOutlined, tagName: 'SortAscendingOutlined' },
              { component: Icons.SortDescendingOutlined, tagName: 'SortDescendingOutlined' },
              { component: Icons.SummationOutlined, tagName: 'SummationOutlined' },
              { component: Icons.TableOutlined, tagName: 'TableOutlined' },
              { component: Icons.ZoomInOutlined, tagName: 'ZoomInOutlined' },
              { component: Icons.ZoomOutOutlined, tagName: 'ZoomOutOutlined' },
            ],
          },
        ],
      },
      {
        id: 'data',
        title: '数据',
        children: [
          {
            id: 'outlined',
            title: '',
            children: [
              { component: Icons.BarChartOutlined, tagName: 'BarChartOutlined' },
              { component: Icons.LineChartOutlined, tagName: 'LineChartOutlined' },
              { component: Icons.PieChartOutlined, tagName: 'PieChartOutlined' },
              { component: Icons.StockChartOutlined, tagName: 'StockChartOutlined' },
            ],
          },
        ],
      },
      {
        id: 'file',
        title: '文件',
        children: [
          {
            id: 'colorful',
            title: '多色型',
            children: [
              { component: Icons.ExcelColorful, tagName: 'ExcelColorful' },

              { component: Icons.ExeColorful, tagName: 'ExeColorful' },

              { component: Icons.JpgColorful, tagName: 'JpgColorful' },

              { component: Icons.MusicColorful, tagName: 'MusicColorful' },

              { component: Icons.PdfColorful, tagName: 'PdfColorful' },

              { component: Icons.PptColorful, tagName: 'PptColorful' },

              { component: Icons.QuestionColorful, tagName: 'QuestionColorful' },

              { component: Icons.WordColorful, tagName: 'WordColorful' },

              { component: Icons.ZipColorful, tagName: 'ZipColorful' },
            ],
          },
        ],
      },
    ]
  }, [])

  const renderIcon = React.useCallback(({ component: Component, tagName }) => {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '200px',
          padding: '24px 0',
          margin: '12px',
          marginLeft: '0px',
          background: '#f2f4f7',
          borderRadius: '8px',
        }}
      >
        <Component style={{ fontSize: '32px' }} />
        <div style={{ marginTop: '24px', fontSize: '14px' }}>{tagName}</div>
      </div>
    )
  }, [])

  return (
    <>
      <h1>Icons</h1>
      <div className="icons-basic__wrap" style={{ marginTop: -24 }}>
        {iconGroups.map((groupItem) => {
          return (
            <React.Fragment key={groupItem.id}>
              <div style={{ lineHeight: '24px', fontSize: '20px', margin: '24px 0 16px' }}>
                {groupItem.title}
              </div>
              {groupItem.children.map((typeItem) => (
                <React.Fragment key={typeItem.id}>
                  <div style={{ lineHeight: '22px', fontSize: '16px', marginBottom: 8 }}>
                    {typeItem.title}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {typeItem.children.map(renderIcon)}
                  </div>
                </React.Fragment>
              ))}
            </React.Fragment>
          )
        })}
      </div>
    </>
  )
}
