# Icons 图标集

语义化的矢量图标集合。需要安装 `@hi-ui/icons` 图标组件包，然后从中引入。

## 使用示例

### 通用


```tsx
import React from 'react'
import * as Icons from '@hi-ui/icons'
import message from '@hi-ui/message' 
export const Basic = () => {
 const icons = React.useMemo(() => {
 return [
 {
 id: 'filled',
 title: '面型',
 children: [
 { component: Icons.AcceptanceFilled, tagName: 'AcceptanceFilled' },
 { component: Icons.AiFilled, tagName: 'AiFilled' },
 { component: Icons.AlarmClockFilled, tagName: 'AlarmClockFilled' },
 { component: Icons.AlarmFilled, tagName: 'AlarmFilled' },
 { component: Icons.AppStoreFilled, tagName: 'AppStoreFilled' },
 { component: Icons.ApproveFilled, tagName: 'ApproveFilled' },
 { component: Icons.ArchiveFilled, tagName: 'ArchiveFilled' },
 { component: Icons.AssetMonitorFilled, tagName: 'AssetMonitorFilled' },
 { component: Icons.AudioFilled, tagName: 'AudioFilled' },
 { component: Icons.BankCardFilled, tagName: 'BankCardFilled' },
 { component: Icons.BellFilled, tagName: 'BellFilled' },
 { component: Icons.BlockFilled, tagName: 'BlockFilled' },
 { component: Icons.BookmarkFilled, tagName: 'BookmarkFilled' },
 { component: Icons.BoxFilled, tagName: 'BoxFilled' },
 { component: Icons.BuildingFilled, tagName: 'BuildingFilled' },
 { component: Icons.BulbFilled, tagName: 'BulbFilled' },
 { component: Icons.BusinessCardFilled, tagName: 'BusinessCardFilled' },
 {
 component: Icons.BusinessCardTransverseFilled,
 tagName: 'BusinessCardTransverseFilled',
 },
 { component: Icons.CalculatorFilled, tagName: 'CalculatorFilled' },
 { component: Icons.CalendarFilled, tagName: 'CalendarFilled' },
 { component: Icons.CallFilled, tagName: 'CallFilled' },
 { component: Icons.CameraFilled, tagName: 'CameraFilled' },
 { component: Icons.Car2Filled, tagName: 'Car2Filled' },
 { component: Icons.CarFilled, tagName: 'CarFilled' },
 { component: Icons.CertificateFilled, tagName: 'CertificateFilled' },
 { component: Icons.Chat2Filled, tagName: 'Chat2Filled' },
 { component: Icons.ChatFilled, tagName: 'ChatFilled' },
 { component: Icons.CloudDownloadFilled, tagName: 'CloudDownloadFilled' },
 { component: Icons.CloudFilled, tagName: 'CloudFilled' },
 { component: Icons.CloudUploadFilled, tagName: 'CloudUploadFilled' },
 { component: Icons.CollectionFilled, tagName: 'CollectionFilled' },
 { component: Icons.CompassFilled, tagName: 'CompassFilled' },
 { component: Icons.CustomerServiceFilled, tagName: 'FrameFilled' },
 { component: Icons.DataMonitorFilled, tagName: 'DataMonitorFilled' },
 { component: Icons.DislikeFilled, tagName: 'DislikeFilled' },
 { component: Icons.DocumentExclamationFilled, tagName: 'DocumentExclamationFilled' },
 { component: Icons.DocumentFilled, tagName: 'DocumentFilled' },
 { component: Icons.DocumentVideoFilled, tagName: 'DocumentVideoFilled' },
 { component: Icons.DocumentZipFilled, tagName: 'DocumentZipFilled' },
 { component: Icons.EndDateFilled, tagName: 'EndDateFilled' },
 { component: Icons.ExpressionFilled, tagName: 'ExpressionFilled' },
 { component: Icons.FireFilled, tagName: 'FireFilled' },
 { component: Icons.FlagFilled, tagName: 'FlagFilled' },
 { component: Icons.FolderFilled, tagName: 'FolderFilled' },
 { component: Icons.FolderOpenFilled, tagName: 'FolderOpenFilled' },
 { component: Icons.GlassesFilled, tagName: 'GlassesFilled' },
 { component: Icons.GlobalFilled, tagName: 'GlobalFilled' },
 { component: Icons.HeadphonesFilled, tagName: 'HeadphonesFilled' },
 { component: Icons.HeartFilled, tagName: 'HeartFilled' },
 { component: Icons.HomeFilled, tagName: 'HomeFilled' },
 { component: Icons.InStockFilled, tagName: 'InStockFilled' },
 { component: Icons.KeyFilled, tagName: 'KeyFilled' },
 { component: Icons.LeaseFilled, tagName: 'LeaseFilled' },
 { component: Icons.LightningFilled, tagName: 'LightningFilled' },
 { component: Icons.LikeFilled, tagName: 'LikeFilled' },
 { component: Icons.LocationFilled, tagName: 'LocationFilled' },
 { component: Icons.LockFilled, tagName: 'LockFilled' },
 { component: Icons.LoudspeakerFilled, tagName: 'LoudspeakerFilled' },
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
 { component: Icons.Phone2Filled, tagName: 'Phone2Filled' },
 { component: Icons.Phone3Filled, tagName: 'Phone3Filled' },
 { component: Icons.PhoneFilled, tagName: 'PhoneFilled' },
 { component: Icons.PictureFilled, tagName: 'PictureFilled' },
 { component: Icons.PinFilled, tagName: 'PinFilled' },
 { component: Icons.PlayFilled, tagName: 'PlayFilled' },
 { component: Icons.PositionFilled, tagName: 'PositionFilled' },
 { component: Icons.PrinterFilled, tagName: 'PrinterFilled' },
 { component: Icons.QrCodeFilled, tagName: 'QrCodeFilled' },
 { component: Icons.RefrigeratorFilled, tagName: 'RefrigeratorFilled' },
 { component: Icons.RelationFilled, tagName: 'RelationFilled' },
 { component: Icons.RmbFilled, tagName: 'RmbFilled' },
 { component: Icons.RobotFilled, tagName: 'RobotFilled' },
 { component: Icons.RoomFilled, tagName: 'RoomFilled' },
 { component: Icons.SadFilled, tagName: 'SadFilled' },
 { component: Icons.SaveFilled, tagName: 'SaveFilled' },
 { component: Icons.SearchFilled, tagName: 'SearchFilled' },
 { component: Icons.SendOutFilled, tagName: 'SendOutFilled' },
 { component: Icons.SettingFilled, tagName: 'SettingFilled' },
 { component: Icons.ShieldFilled, tagName: 'ShieldFilled' },
 { component: Icons.ShopFilled, tagName: 'ShopFilled' },
 { component: Icons.ShoppingCartFilled, tagName: 'ShoppingCartFilled' },
 { component: Icons.ShoppingFilled, tagName: 'ShoppingFilled' },
 { component: Icons.SkinFilled, tagName: 'SkinFilled' },
 { component: Icons.SmileFilled, tagName: 'SmileFilled' },
 { component: Icons.SoundFilled, tagName: 'SoundFilled' },
 { component: Icons.StarFilled, tagName: 'StarFilled' },
 { component: Icons.StartDateFilled, tagName: 'StartDateFilled' },
 { component: Icons.StockroomFilled, tagName: 'StockroomFilled' },
 { component: Icons.StudentFilled, tagName: 'StudentFilled' },
 { component: Icons.SunFilled, tagName: 'SunFilled' },
 { component: Icons.TagFilled, tagName: 'TagFilled' },
 { component: Icons.TalkFilled, tagName: 'TalkFilled' },
 { component: Icons.TaskFilled, tagName: 'TaskFilled' },
 { component: Icons.TemplateFilled, tagName: 'TemplateFilled' },
 { component: Icons.TimeFilled, tagName: 'TimeFilled' },
 { component: Icons.ToolFilled, tagName: 'ToolFilled' },
 { component: Icons.TranspondFilled, tagName: 'TranspondFilled' },
 { component: Icons.TravelFilled, tagName: 'TravelFilled' },
 { component: Icons.TruckFilled, tagName: 'TruckFilled' },
 { component: Icons.UmberFilled, tagName: 'UmberFilled' },
 { component: Icons.UmbrellaFilled, tagName: 'UmbrellaFilled' },
 { component: Icons.UnlockFilled, tagName: 'UnlockFilled' },
 { component: Icons.UpdateFilled, tagName: 'UpdateFilled' },
 { component: Icons.UserFilled, tagName: 'UserFilled' },
 { component: Icons.VacantFilled, tagName: 'VacantFilled' },
 { component: Icons.VideoCameraFilled, tagName: 'VideoCameraFilled' },
 { component: Icons.VipFilled, tagName: 'VipFilled' },
 { component: Icons.VoiceFilled, tagName: 'VoiceFilled' },
 { component: Icons.WashMachineFilled, tagName: 'WashMachineFilled' },
 { component: Icons.WebpageFilled, tagName: 'WebpageFilled' },
 { component: Icons.WorkOrderFilled, tagName: 'WorkOrderFilled' },
 ],
 },
 {
 id: 'outlined',
 title: '线型',
 children: [
 { component: Icons.AcceptanceOutlined, tagName: 'AcceptanceOutlined' },
 { component: Icons.AiOutlined, tagName: 'AiOutlined' },
 { component: Icons.AlarmClockOutlined, tagName: 'AlarmClockOutlined' },
 { component: Icons.AlarmOutlined, tagName: 'AlarmOutlined' },
 { component: Icons.AppStoreOutlined, tagName: 'AppStoreOutlined' },
 { component: Icons.ApproveOutlined, tagName: 'ApproveOutlined' },
 { component: Icons.ArchiveOutlined, tagName: 'ArchiveOutlined' },
 { component: Icons.AreaOutlined, tagName: 'AreaOutlined' },
 { component: Icons.AssetMonitorOutlined, tagName: 'AssetMonitorOutlined' },
 { component: Icons.AssetsOutlined, tagName: 'AssetsOutlined' },
 { component: Icons.AssociateOutlined, tagName: 'AssociateOutlined' },
 { component: Icons.AudioOutlined, tagName: 'AudioOutlined' },
 { component: Icons.BankCardOutlined, tagName: 'BankCardOutlined' },
 { component: Icons.BarcodeOutlined, tagName: 'BarcodeOutlined' },
 { component: Icons.BarsOutlined, tagName: 'BarsOutlined' },
 { component: Icons.BatchUpdateOutlined, tagName: 'BatchUpdateOutlined' },
 { component: Icons.BellOutlined, tagName: 'BellOutlined' },
 { component: Icons.BlockOutlined, tagName: 'BlockOutlined' },
 { component: Icons.BookmarkOutlined, tagName: 'BookmarkOutlined' },
 { component: Icons.BoxOutlined, tagName: 'BoxOutlined' },
 { component: Icons.BuildingOutlined, tagName: 'BuildingOutlined' },
 { component: Icons.BulbOutlined, tagName: 'BulbOutlined' },
 { component: Icons.BusinessCardOutlined, tagName: 'BusinessCardOutlined' },
 {
 component: Icons.BusinessCardTransverseOutlined,
 tagName: 'BusinessCardTransverseOutlined',
 },
 { component: Icons.CalculatorOutlined, tagName: 'CalculatorOutlined' },
 { component: Icons.CalendarOutlined, tagName: 'CalendarOutlined' },
 { component: Icons.CallOutlined, tagName: 'CallOutlined' },
 { component: Icons.CameraOutlined, tagName: 'CameraOutlined' },
 { component: Icons.Car2Outlined, tagName: 'Car2Outlined' },
 { component: Icons.CarOutlined, tagName: 'CarOutlined' },
 { component: Icons.CertificateOutlined, tagName: 'CertificateOutlined' },
 { component: Icons.Chat2Outlined, tagName: 'Chat2Outlined' },
 { component: Icons.ChatForwardingOutlined, tagName: 'ChatForwardingOutlined' },
 { component: Icons.ChatOutlined, tagName: 'ChatOutlined' },
 { component: Icons.ClipOutlined, tagName: 'ClipOutlined' },
 { component: Icons.CloseCodeOutlined, tagName: 'CloseCodeOutlined' },
 { component: Icons.ClockOutlined, tagName: 'ClockOutlined' },
 { component: Icons.CloudDownloadOutlined, tagName: 'CloudDownloadOutlined' },
 { component: Icons.CloudOutlined, tagName: 'CloudOutlined' },
 { component: Icons.CloudUploadOutlined, tagName: 'CloudUploadOutlined' },
 { component: Icons.CollectionOutlined, tagName: 'CollectionOutlined' },
 { component: Icons.CommendOutlined, tagName: 'CommendOutlined' },
 { component: Icons.CompassOutlined, tagName: 'CompassOutlined' },
 { component: Icons.ContractOutlined, tagName: 'ContractOutlined' },
 { component: Icons.CustomerServiceOutlined, tagName: 'CustomerServiceOutlined' },
 { component: Icons.DataExportOutlined, tagName: 'DataExportOutlined' },
 { component: Icons.DataMonitorOutlined, tagName: 'DataMonitorOutlined' },
 { component: Icons.DiagramOutlined, tagName: 'DiagramOutlined' },
 { component: Icons.DislikeOutlined, tagName: 'DislikeOutlined' },
 { component: Icons.DocumentExclamationOutlined, tagName: 'DocumentExclamationOutlined' },
 { component: Icons.DocumentOutlined, tagName: 'DocumentOutlined' },
 { component: Icons.DocumentVideoOutlined, tagName: 'DocumentVideoOutlined' },
 { component: Icons.DocumentZipOutlined, tagName: 'DocumentZipOutlined' },
 { component: Icons.DownUpOutlined, tagName: 'DownUpOutlined' },
 { component: Icons.DownloadOutlined, tagName: 'DownloadOutlined' },
 { component: Icons.DragDotOutlined, tagName: 'DragDotOutlined' },
 { component: Icons.EndDateOutlined, tagName: 'EndDateOutlined' },
 { component: Icons.ExportOutlined, tagName: 'ExportOutlined' },
 { component: Icons.ExpressionOutlined, tagName: 'ExpressionOutlined' },
 { component: Icons.EyeInvisibleOutlined, tagName: 'EyeInvisibleOutlined' },
 { component: Icons.EyeOutlined, tagName: 'EyeOutlined' },
 { component: Icons.FireOutlined, tagName: 'FireOutlined' },
 { component: Icons.FlagOutlined, tagName: 'FlagOutlined' },
 { component: Icons.FolderOpenOutlined, tagName: 'FolderOpenOutlined' },
 { component: Icons.FolderOutlined, tagName: 'FolderOutlined' },
 { component: Icons.ForwardOutlined, tagName: 'ForwardOutlined' },
 { component: Icons.FrameOutlined, tagName: 'FrameOutlined' },
 { component: Icons.FreezeOutlined, tagName: 'FreezeOutlined' },
 { component: Icons.GlassesOutlined, tagName: 'GlassesOutlined' },
 { component: Icons.GlobalOutlined, tagName: 'GlobalOutlined' },
 { component: Icons.GuideOutlined, tagName: 'GuideOutlined' },
 { component: Icons.GuidelinesOutlined, tagName: 'GuidelinesOutlined' },
 { component: Icons.HangUpOutlined, tagName: 'HangUpOutlined' },
 { component: Icons.HeadphonesOutlined, tagName: 'HeadphonesOutlined' },
 { component: Icons.HeartOutlined, tagName: 'HeartOutlined' },
 { component: Icons.HeartSimpleOutlined, tagName: 'HeartSimpleOutlined' },
 { component: Icons.HomeOutlined, tagName: 'HomeOutlined' },
 { component: Icons.ImportOutlined, tagName: 'ImportOutlined' },
 { component: Icons.InStockOutlined, tagName: 'InStockOutlined' },
 { component: Icons.KeyOutlined, tagName: 'KeyOutlined' },
 { component: Icons.LeaseOutlined, tagName: 'LeaseOutlined' },
 { component: Icons.LightningOutlined, tagName: 'LightningOutlined' },
 { component: Icons.LikeOutlined, tagName: 'LikeOutlined' },
 { component: Icons.LinkOutlined, tagName: 'LinkOutlined' },
 { component: Icons.LocationOutlined, tagName: 'LocationOutlined' },
 { component: Icons.LockOutlined, tagName: 'LockOutlined' },
 { component: Icons.LoudspeakerOutlined, tagName: 'LoudspeakerOutlined' },
 { component: Icons.MailOpenOutlined, tagName: 'MailOpenOutlined' },
 { component: Icons.MailOutlined, tagName: 'MailOutlined' },
 { component: Icons.MailSendOutlined, tagName: 'MailSendOutlined' },
 { component: Icons.ManOutlined, tagName: 'ManOutlined' },
 { component: Icons.MenuOutlined, tagName: 'MenuOutlined' },
 { component: Icons.MessageOutlined, tagName: 'MessageOutlined' },
 { component: Icons.MobileOutlined, tagName: 'MobileOutlined' },
 { component: Icons.MonitorOutlined, tagName: 'MonitorOutlined' },
 { component: Icons.MoonOutlined, tagName: 'MoonOutlined' },
 { component: Icons.MoveOutlined, tagName: 'MoveOutlined' },
 { component: Icons.OutOfStockOutlined, tagName: 'OutOfStockOutlined' },
 { component: Icons.PadOutlined, tagName: 'PadOutlined' },
 { component: Icons.PauseOutlined, tagName: 'PauseOutlined' },
 { component: Icons.PaymentOutlined, tagName: 'PaymentOutlined' },
 { component: Icons.Phone2Outlined, tagName: 'Phone2Outlined' },
 { component: Icons.Phone3Outlined, tagName: 'Phone3Outlined' },
 { component: Icons.PhoneOutlined, tagName: 'PhoneOutlined' },
 { component: Icons.PictureOutlined, tagName: 'PictureOutlined' },
 { component: Icons.PinOutlined, tagName: 'PinOutlined' },
 { component: Icons.PlayOutlined, tagName: 'PlayOutlined' },
 { component: Icons.PositionOutlined, tagName: 'PositionOutlined' },
 { component: Icons.PowerOffOutlined, tagName: 'PowerOffOutlined' },
 { component: Icons.PrinterOutlined, tagName: 'PrinterOutlined' },
 { component: Icons.QrCodeOutlined, tagName: 'QrCodeOutlined' },
 { component: Icons.QuantityOutlined, tagName: 'QuantityOutlined' },
 { component: Icons.RefrigeratorOutlined, tagName: 'RefrigeratorOutlined' },
 { component: Icons.RelationOutlined, tagName: 'RelationOutlined' },
 { component: Icons.ResetOutlined, tagName: 'ResetOutlined' },
 { component: Icons.RmbOutlined, tagName: 'RmbOutlined' },
 { component: Icons.RobotOutlined, tagName: 'RobotOutlined' },
 { component: Icons.RoomOutlined, tagName: 'RoomOutlined' },
 { component: Icons.SadOutlined, tagName: 'SadOutlined' },
 { component: Icons.ScanOutlined, tagName: 'ScanOutlined' },
 { component: Icons.SearchOutlined, tagName: 'SearchOutlined' },
 { component: Icons.SealOutlined, tagName: 'SealOutlined' },
 { component: Icons.SendOutOutlined, tagName: 'SendOutOutlined' },
 { component: Icons.SettingOutlined, tagName: 'SettingOutlined' },
 { component: Icons.ShareOutlined, tagName: 'ShareOutlined' },
 { component: Icons.ShieldOutlined, tagName: 'ShieldOutlined' },
 { component: Icons.ShopOutlined, tagName: 'ShopOutlined' },
 { component: Icons.ShoppingCartOutlined, tagName: 'ShoppingCartOutlined' },
 { component: Icons.ShoppingOutlined, tagName: 'ShoppingOutlined' },
 { component: Icons.ShowCode2Outlined, tagName: 'ShowCode2Outlined' },
 { component: Icons.ShowCodeOutlined, tagName: 'ShowCodeOutlined' },
 { component: Icons.SkinOutlined, tagName: 'SkinOutlined' },
 { component: Icons.SlashOutlined, tagName: 'SlashOutlined' },
 { component: Icons.SmileOutlined, tagName: 'SmileOutlined' },
 { component: Icons.SoundOutlined, tagName: 'SoundOutlined' },
 { component: Icons.StarOutlined, tagName: 'StarOutlined' },
 { component: Icons.StartDateOutlined, tagName: 'StartDateOutlined' },
 { component: Icons.StockroomOutlined, tagName: 'StockroomOutlined' },
 { component: Icons.StudentOutlined, tagName: 'StudentOutlined' },
 { component: Icons.SunOutlined, tagName: 'SunOutlined' },
 { component: Icons.SwitchOutlined, tagName: 'SwitchOutlined' },
 { component: Icons.SynchronizeOutlined, tagName: 'SynchronizeOutlined' },
 { component: Icons.TagOutlined, tagName: 'TagOutlined' },
 { component: Icons.TalkOutlined, tagName: 'TalkOutlined' },
 { component: Icons.TaskOutlined, tagName: 'TaskOutlined' },
 { component: Icons.TemplateOutlined, tagName: 'TemplateOutlined' },
 { component: Icons.TextExtractionOutlined, tagName: 'TextExtractionOutlined' },
 { component: Icons.TimeOutlined, tagName: 'TimeOutlined' },
 { component: Icons.TimeRewindOutlined, tagName: 'TimeRewindOutlined' },
 { component: Icons.ToolOutlined, tagName: 'ToolOutlined' },
 { component: Icons.TrackingOutlined, tagName: 'TrackingOutlined' },
 { component: Icons.TravelOutlined, tagName: 'TravelOutlined' },
 { component: Icons.TruckOutlined, tagName: 'TruckOutlined' },
 { component: Icons.UmberOutlined, tagName: 'UmberOutlined' },
 { component: Icons.UmbrellaOutlined, tagName: 'UmbrellaOutlined' },
 { component: Icons.UnfreezeOutlined, tagName: 'UnfreezeOutlined' },
 { component: Icons.UnlockOutlined, tagName: 'UnlockOutlined' },
 { component: Icons.UpdateOutlined, tagName: 'UpdateOutlined' },
 { component: Icons.UploadOutlined, tagName: 'UploadOutlined' },
 { component: Icons.UserAddOutlined, tagName: 'UserAddOutlined' },
 { component: Icons.UserOutlined, tagName: 'UserOutlined' },
 { component: Icons.UsersOutlined, tagName: 'UsersOutlined' },
 { component: Icons.VacantOutlined, tagName: 'VacantOutlined' },
 { component: Icons.VideoCameraOutlined, tagName: 'VideoCameraOutlined' },
 { component: Icons.VipOutlined, tagName: 'VipOutlined' },
 { component: Icons.VoiceOutlined, tagName: 'VoiceOutlined' },
 { component: Icons.WarehouseOutlined, tagName: 'WarehouseOutlined' },
 { component: Icons.WashMachineOutlined, tagName: 'WashMachineOutlined' },
 { component: Icons.WebpageOutlined, tagName: 'WebpageOutlined' },
 { component: Icons.WeighingOutlined, tagName: 'WeighingOutlined' },
 { component: Icons.WithdrawOutlined, tagName: 'WithdrawOutlined' },
 { component: Icons.WomanOutlined, tagName: 'WomanOutlined' },
 { component: Icons.WorkOrderOutlined, tagName: 'WorkOrderOutlined' },
 ],
 },
 {
 id: 'colorful',
 title: '多色型',
 children: [{ component: Icons.FeedbackColorful, tagName: 'FeedbackColorful' }],
 },
 ]
 }, [])

 const renderIcon = React.useCallback(({ component: Component, tagName }) => {
 return (
 <div
 key={tagName}
 style={{
 display: 'flex',
 flexDirection: 'column',
 alignItems: 'center',
 justifyContent: 'center',
 padding: '16px 0',
 borderRadius: '8px',
 }}
 onMouseEnter={(evt) => {
 evt.currentTarget.style.backgroundColor = '#f2f4f7'
 evt.currentTarget.style.cursor = 'pointer'
 }}
 onMouseLeave={(evt) => {
 evt.currentTarget.style.backgroundColor = 'transparent'
 evt.currentTarget.style.cursor = 'default'
 }}
 onClick={() => {
 try {
 const textArea = document.createElement('textarea')
 textArea.value = `<${tagName} />`
 textArea.style.position = 'fixed'
 textArea.style.opacity = '0'
 document.body.appendChild(textArea)
 textArea.select()
 document.execCommand('copy')
 document.body.removeChild(textArea)
 message.open({
 title: `复制成功：\n<${tagName} />`,
 type: 'success',
 })
 } catch (err) {
 console.error('复制失败:', err)
 message.open({
 title: '复制失败',
 type: 'error',
 })
 }
 }}
 >
 <Component style={{ fontSize: '32px' }} />
 <div style={{ marginTop: '16px', fontSize: '12px' }}>{tagName}</div>
 </div>
 )
 }, [])

 return (
 <> 
 <div className="icons-basic__wrap">
 {icons.map((typeItem) => (
 <React.Fragment key={typeItem.id}>
 <div style={{ lineHeight: '22px', fontSize: '16px', margin: '8px 0' }}>
 {typeItem.title}
 </div>
 <div
 style={{
 display: 'grid',
 gap: 2,
 gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
 }}
 >
 {typeItem.children.map(renderIcon)}
 </div>
 </React.Fragment>
 ))}
 </div>
 </>
 )
}

```


### 提示


```tsx
import React from 'react'
import * as Icons from '@hi-ui/icons'
import message from '@hi-ui/message' 
export const Alert = () => {
 const icons = React.useMemo(() => {
 return [
 {
 id: 'filled',
 title: '面型',
 children: [
 { component: Icons.AddCircleFilled, tagName: 'AddCircleFilled' },
 { component: Icons.CheckCircleFilled, tagName: 'CheckCircleFilled' },
 { component: Icons.CheckSquareFilled, tagName: 'CheckSquareFilled' },
 { component: Icons.CloseCircleFilled, tagName: 'CloseCircleFilled' },
 { component: Icons.CloseSquareFilled, tagName: 'CloseSquareFilled' },
 { component: Icons.ExclamationCircleFilled, tagName: 'ExclamationCircleFilled' },
 { component: Icons.InfoCircleFilled, tagName: 'InfoCircleFilled' },
 { component: Icons.MinusSquareFilled, tagName: 'MinusSquareFilled' },
 { component: Icons.PlusSquareFilled, tagName: 'PlusSquareFilled' },
 { component: Icons.QuestionCircleFilled, tagName: 'QuestionCircleFilled' },
 { component: Icons.StopFilled, tagName: 'StopFilled' },
 { component: Icons.WarningFilled, tagName: 'WarningFilled' },
 ],
 },
 {
 id: 'outlined',
 title: '线型',
 children: [
 { component: Icons.CheckCircleOutlined, tagName: 'CheckCircleOutlined' },
 { component: Icons.CheckOutlined, tagName: 'CheckOutlined' },
 { component: Icons.CheckSquareOutlined, tagName: 'CheckSquareOutlined' },
 { component: Icons.CloseCircleOutlined, tagName: 'CloseCircleOutlined' },
 { component: Icons.CloseOutlined, tagName: 'CloseOutlined' },
 { component: Icons.CloseSquareOutlined, tagName: 'CloseSquareOutlined' },
 { component: Icons.ExclamationCircleOutlined, tagName: 'ExclamationCircleOutlined' },
 { component: Icons.ExclamationOutlined, tagName: 'ExclamationOutlined' },
 { component: Icons.InfoCircleOutlined, tagName: 'InfoCircleOutlined' },
 { component: Icons.InfoOutlined, tagName: 'InfoOutlined' },
 { component: Icons.MinusOutlined, tagName: 'MinusOutlined' },
 { component: Icons.MinusSquareOutlined, tagName: 'MinusSquareOutlined' },
 { component: Icons.PlusOutlined, tagName: 'PlusOutlined' },
 { component: Icons.PlusSquareOutlined, tagName: 'PlusSquareOutlined' },
 { component: Icons.QuestionCircleOutlined, tagName: 'QuestionCircleOutlined' },
 { component: Icons.QuestionOutlined, tagName: 'QuestionOutlined' },
 { component: Icons.StopOutlined, tagName: 'StopOutlined' },
 { component: Icons.WarningOutlined, tagName: 'WarningOutlined' },
 ],
 },
 ]
 }, [])

 const renderIcon = React.useCallback(({ component: Component, tagName }) => {
 return (
 <div
 key={tagName}
 style={{
 display: 'flex',
 flexDirection: 'column',
 alignItems: 'center',
 justifyContent: 'center',
 padding: '16px 0',
 borderRadius: '8px',
 }}
 onMouseEnter={(evt) => {
 evt.currentTarget.style.backgroundColor = '#f2f4f7'
 evt.currentTarget.style.cursor = 'pointer'
 }}
 onMouseLeave={(evt) => {
 evt.currentTarget.style.backgroundColor = 'transparent'
 evt.currentTarget.style.cursor = 'default'
 }}
 onClick={() => {
 try {
 const textArea = document.createElement('textarea')
 textArea.value = `<${tagName} />`
 textArea.style.position = 'fixed'
 textArea.style.opacity = '0'
 document.body.appendChild(textArea)
 textArea.select()
 document.execCommand('copy')
 document.body.removeChild(textArea)
 message.open({
 title: `复制成功：\n<${tagName} />`,
 type: 'success',
 })
 } catch (err) {
 console.error('复制失败:', err)
 message.open({
 title: '复制失败',
 type: 'error',
 })
 }
 }}
 >
 <Component style={{ fontSize: '32px' }} />
 <div style={{ marginTop: '16px', fontSize: '12px' }}>{tagName}</div>
 </div>
 )
 }, [])

 return (
 <> 
 <div className="icons-alert__wrap">
 {icons.map((typeItem) => (
 <React.Fragment key={typeItem.id}>
 <div style={{ lineHeight: '22px', fontSize: '16px', margin: '8px 0' }}>
 {typeItem.title}
 </div>
 <div
 style={{
 display: 'grid',
 gap: 2,
 gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
 }}
 >
 {typeItem.children.map(renderIcon)}
 </div>
 </React.Fragment>
 ))}
 </div>
 </>
 )
}

```


### 方向


```tsx
import React from 'react'
import * as Icons from '@hi-ui/icons'
import message from '@hi-ui/message' 
export const Direction = () => {
 const icons = React.useMemo(() => {
 return [
 {
 id: 'filled',
 title: '面型',
 children: [
 { component: Icons.CaretDownFilled, tagName: 'CaretDownFilled' },
 { component: Icons.CaretLeftFilled, tagName: 'CaretLeftFilled' },
 { component: Icons.CaretRightFilled, tagName: 'CaretRightFilled' },
 { component: Icons.CaretUpFilled, tagName: 'CaretUpFilled' },
 { component: Icons.DragFilled, tagName: 'DragFilled' },
 { component: Icons.SortFilled, tagName: 'SortFilled' },
 ],
 },
 {
 id: 'outlined',
 title: '线型',
 children: [
 { component: Icons.ArrowDownBoldOutlined, tagName: 'ArrowDownBoldOutlined' },
 { component: Icons.ArrowDownOutlined, tagName: 'ArrowDownOutlined' },
 { component: Icons.ArrowLeftBoldOutlined, tagName: 'ArrowLeftBoldOutlined' },
 { component: Icons.ArrowLeftOutlined, tagName: 'ArrowLeftOutlined' },
 { component: Icons.ArrowRightBoldOutlined, tagName: 'ArrowRightBoldOutlined' },
 { component: Icons.ArrowRightOutlined, tagName: 'ArrowRightOutlined' },
 { component: Icons.ArrowUpBoldOutlined, tagName: 'ArrowUpBoldOutlined' },
 { component: Icons.ArrowUpOutlined, tagName: 'ArrowUpOutlined' },
 { component: Icons.DirectionDownBoldOutlined, tagName: 'DirectionDownBoldOutlined' },
 { component: Icons.DirectionDownOutlined, tagName: 'DirectionDownOutlined' },
 { component: Icons.DirectionLeftBoldOutlined, tagName: 'DirectionLeftBoldOutlined' },
 { component: Icons.DirectionLeftOutlined, tagName: 'DirectionLeftOutlined' },
 { component: Icons.DirectionRightBoldOutlined, tagName: 'DirectionRightBoldOutlined' },
 { component: Icons.DirectionRightOutlined, tagName: 'DirectionRightOutlined' },
 { component: Icons.DirectionUpBoldOutlined, tagName: 'DirectionUpBoldOutlined' },
 { component: Icons.DirectionUpOutlined, tagName: 'DirectionUpOutlined' },
 { component: Icons.DownBoldOutlined, tagName: 'DownBoldOutlined' },
 { component: Icons.DownOutlined, tagName: 'DownOutlined' },
 { component: Icons.DownShortBoldOutlined, tagName: 'DownShortBoldOutlined' },
 { component: Icons.DownShortOutlined, tagName: 'DownShortOutlined' },
 { component: Icons.ExpandOutlined, tagName: 'ExpandOutlined' },
 { component: Icons.FullscreenExitOutlined, tagName: 'FullscreenExitOutlined' },
 { component: Icons.FullscreenOutlined, tagName: 'FullscreenOutlined' },
 { component: Icons.LeftBoldOutlined, tagName: 'LeftBoldOutlined' },
 { component: Icons.LeftOutlined, tagName: 'LeftOutlined' },
 { component: Icons.LeftRightOutlined, tagName: 'LeftRightOutlined' },
 { component: Icons.LeftShortBoldOutlined, tagName: 'LeftShortBoldOutlined' },
 { component: Icons.LeftShortOutlined, tagName: 'LeftShortOutlined' },
 { component: Icons.MenuFoldOutlined, tagName: 'MenuFoldOutlined' },
 { component: Icons.MenuUnfoldOutlined, tagName: 'MenuUnfoldOutlined' },
 { component: Icons.RightBoldOutlined, tagName: 'RightBoldOutlined' },
 { component: Icons.RightOutlined, tagName: 'RightOutlined' },
 { component: Icons.RightShortBoldOutlined, tagName: 'RightShortBoldOutlined' },
 { component: Icons.RightShortOutlined, tagName: 'RightShortOutlined' },
 { component: Icons.ShrinkOutlined, tagName: 'ShrinkOutlined' },
 { component: Icons.ToBottomOutlined, tagName: 'ToBottomOutlined' },
 { component: Icons.ToTopOutlined, tagName: 'ToTopOutlined' },
 { component: Icons.UpBoldOutlined, tagName: 'UpBoldOutlined' },
 { component: Icons.UpOutlined, tagName: 'UpOutlined' },
 { component: Icons.UpShortBoldOutlined, tagName: 'UpShortBoldOutlined' },
 { component: Icons.UpShortOutlined, tagName: 'UpShortOutlined' },
 ],
 },
 ]
 }, [])

 const renderIcon = React.useCallback(({ component: Component, tagName }) => {
 return (
 <div
 key={tagName}
 style={{
 display: 'flex',
 flexDirection: 'column',
 alignItems: 'center',
 justifyContent: 'center',
 padding: '16px 0',
 borderRadius: '8px',
 }}
 onMouseEnter={(evt) => {
 evt.currentTarget.style.backgroundColor = '#f2f4f7'
 evt.currentTarget.style.cursor = 'pointer'
 }}
 onMouseLeave={(evt) => {
 evt.currentTarget.style.backgroundColor = 'transparent'
 evt.currentTarget.style.cursor = 'default'
 }}
 onClick={() => {
 try {
 const textArea = document.createElement('textarea')
 textArea.value = `<${tagName} />`
 textArea.style.position = 'fixed'
 textArea.style.opacity = '0'
 document.body.appendChild(textArea)
 textArea.select()
 document.execCommand('copy')
 document.body.removeChild(textArea)
 message.open({
 title: `复制成功：\n<${tagName} />`,
 type: 'success',
 })
 } catch (err) {
 console.error('复制失败:', err)
 message.open({
 title: '复制失败',
 type: 'error',
 })
 }
 }}
 >
 <Component style={{ fontSize: '32px' }} />
 <div style={{ marginTop: '16px', fontSize: '12px' }}>{tagName}</div>
 </div>
 )
 }, [])

 return (
 <> 
 <div className="icons-direction__wrap">
 {icons.map((typeItem) => (
 <React.Fragment key={typeItem.id}>
 <div style={{ lineHeight: '22px', fontSize: '16px', margin: '8px 0' }}>
 {typeItem.title}
 </div>
 <div
 style={{
 display: 'grid',
 gap: 2,
 gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
 }}
 >
 {typeItem.children.map(renderIcon)}
 </div>
 </React.Fragment>
 ))}
 </div>
 </>
 )
}

```


### 编辑


```tsx
import React from 'react'
import * as Icons from '@hi-ui/icons'
import message from '@hi-ui/message' 
export const Edit = () => {
 const icons = React.useMemo(() => {
 return [
 {
 id: 'filled',
 title: '面型',
 children: [
 { component: Icons.ClearFilled, tagName: 'ClearFilled' },
 { component: Icons.CopyFilled, tagName: 'CopyFilled' },
 { component: Icons.DeleteFilled, tagName: 'DeleteFilled' },
 { component: Icons.DetailsFilled, tagName: 'DetailsFilled' },
 { component: Icons.DuplicateFilled, tagName: 'DuplicateFilled' },
 { component: Icons.EditFilled, tagName: 'EditFilled' },
 { component: Icons.EllipsisCircleFilled, tagName: 'EllipsisCircleFilled' },
 { component: Icons.EmptyFilled, tagName: 'EmptyFilled' },
 { component: Icons.EqualProportionFilled, tagName: 'EqualProportionFilled' },
 { component: Icons.FilterFilled, tagName: 'FilterFilled' },
 { component: Icons.FolderAddFilled, tagName: 'FolderAddFilled' },
 { component: Icons.FolderMoveFilled, tagName: 'FolderMoveFilled' },
 { component: Icons.PasteFilled, tagName: 'PasteFilled' },
 { component: Icons.RotateLeftFilled, tagName: 'RotateLeftFilled' },
 { component: Icons.RotateRightFilled, tagName: 'RotateRightFilled' },
 { component: Icons.TableFilled, tagName: 'TableFilled' },
 { component: Icons.ZoomInFilled, tagName: 'ZoomInFilled' },
 { component: Icons.ZoomOutFilled, tagName: 'ZoomOutFilled' },
 ],
 },
 {
 id: 'outlined',
 title: '线型',
 children: [
 { component: Icons.AverageOutlined, tagName: 'AverageOutlined' },
 { component: Icons.ClearOutlined, tagName: 'ClearOutlined' },
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
 ]
 }, [])

 const renderIcon = React.useCallback(({ component: Component, tagName }) => {
 return (
 <div
 key={tagName}
 style={{
 display: 'flex',
 flexDirection: 'column',
 alignItems: 'center',
 justifyContent: 'center',
 padding: '16px 0',
 borderRadius: '8px',
 }}
 onMouseEnter={(evt) => {
 evt.currentTarget.style.backgroundColor = '#f2f4f7'
 evt.currentTarget.style.cursor = 'pointer'
 }}
 onMouseLeave={(evt) => {
 evt.currentTarget.style.backgroundColor = 'transparent'
 evt.currentTarget.style.cursor = 'default'
 }}
 onClick={() => {
 try {
 const textArea = document.createElement('textarea')
 textArea.value = `<${tagName} />`
 textArea.style.position = 'fixed'
 textArea.style.opacity = '0'
 document.body.appendChild(textArea)
 textArea.select()
 document.execCommand('copy')
 document.body.removeChild(textArea)
 message.open({
 title: `复制成功：\n<${tagName} />`,
 type: 'success',
 })
 } catch (err) {
 console.error('复制失败:', err)
 message.open({
 title: '复制失败',
 type: 'error',
 })
 }
 }}
 >
 <Component style={{ fontSize: '32px' }} />
 <div style={{ marginTop: '16px', fontSize: '12px' }}>{tagName}</div>
 </div>
 )
 }, [])

 return (
 <> 
 <div className="icons-edit__wrap">
 {icons.map((typeItem) => (
 <React.Fragment key={typeItem.id}>
 <div style={{ lineHeight: '22px', fontSize: '16px', margin: '8px 0' }}>
 {typeItem.title}
 </div>
 <div
 style={{
 display: 'grid',
 gap: 2,
 gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
 }}
 >
 {typeItem.children.map(renderIcon)}
 </div>
 </React.Fragment>
 ))}
 </div>
 </>
 )
}

```


### 文件


```tsx
import React from 'react'
import * as Icons from '@hi-ui/icons'
import message from '@hi-ui/message' 
export const File = () => {
 const icons = React.useMemo(() => {
 return [
 {
 id: 'filled',
 title: '面型',
 children: [
 { component: Icons.FileFilled, tagName: 'FileFilled' },
 { component: Icons.FileExcelFilled, tagName: 'FileExcelFilled' },
 { component: Icons.FileExeFilled, tagName: 'FileExeFilled' },
 { component: Icons.FileJpgFilled, tagName: 'FileJpgFilled' },
 { component: Icons.FileKeynoteFilled, tagName: 'FileKeynoteFilled' },
 { component: Icons.FileMusicFilled, tagName: 'FileMusicFilled' },
 { component: Icons.FilePdfFilled, tagName: 'FilePdfFilled' },
 { component: Icons.FilePptFilled, tagName: 'FilePptFilled' },
 { component: Icons.FileQuestionFilled, tagName: 'FileQuestionFilled' },
 { component: Icons.FileTxtFilled, tagName: 'FileTxtFilled' },
 { component: Icons.FileVideoFilled, tagName: 'FileVideoFilled' },
 { component: Icons.FileWordFilled, tagName: 'FileWordFilled' },
 { component: Icons.FileZipFilled, tagName: 'FileZipFilled' },
 ],
 },
 {
 id: 'outlined',
 title: '线型',
 children: [
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
 ],
 },
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
 ]
 }, [])

 const renderIcon = React.useCallback(({ component: Component, tagName }) => {
 return (
 <div
 key={tagName}
 style={{
 display: 'flex',
 flexDirection: 'column',
 alignItems: 'center',
 justifyContent: 'center',
 padding: '16px 0',
 borderRadius: '8px',
 }}
 onMouseEnter={(evt) => {
 evt.currentTarget.style.backgroundColor = '#f2f4f7'
 evt.currentTarget.style.cursor = 'pointer'
 }}
 onMouseLeave={(evt) => {
 evt.currentTarget.style.backgroundColor = 'transparent'
 evt.currentTarget.style.cursor = 'default'
 }}
 onClick={() => {
 try {
 const textArea = document.createElement('textarea')
 textArea.value = `<${tagName} />`
 textArea.style.position = 'fixed'
 textArea.style.opacity = '0'
 document.body.appendChild(textArea)
 textArea.select()
 document.execCommand('copy')
 document.body.removeChild(textArea)
 message.open({
 title: `复制成功：\n<${tagName} />`,
 type: 'success',
 })
 } catch (err) {
 console.error('复制失败:', err)
 message.open({
 title: '复制失败',
 type: 'error',
 })
 }
 }}
 >
 <Component style={{ fontSize: '32px' }} />
 <div style={{ marginTop: '16px', fontSize: '12px' }}>{tagName}</div>
 </div>
 )
 }, [])

 return (
 <> 
 <div className="icons-file__wrap">
 {icons.map((typeItem) => (
 <React.Fragment key={typeItem.id}>
 <div style={{ lineHeight: '22px', fontSize: '16px', margin: '8px 0' }}>
 {typeItem.title}
 </div>
 <div
 style={{
 display: 'grid',
 gap: 2,
 gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
 }}
 >
 {typeItem.children.map(renderIcon)}
 </div>
 </React.Fragment>
 ))}
 </div>
 </>
 )
}

```


### 数据


```tsx
import React from 'react'
import * as Icons from '@hi-ui/icons'
import message from '@hi-ui/message' 
export const Data = () => {
 const icons = React.useMemo(() => {
 return [
 {
 id: 'filled',
 title: '面型',
 children: [
 { component: Icons.BarChartFilled, tagName: 'BarChartFilled' },
 { component: Icons.PieChartFilled, tagName: 'PieChartFilled' },
 { component: Icons.StockChartFilled, tagName: 'StockChartFilled' },
 ],
 },
 {
 id: 'outlined',
 title: '线型',
 children: [
 { component: Icons.BarChartOutlined, tagName: 'BarChartOutlined' },
 { component: Icons.LineChartOutlined, tagName: 'LineChartOutlined' },
 { component: Icons.PieChartOutlined, tagName: 'PieChartOutlined' },
 { component: Icons.StockChartOutlined, tagName: 'StockChartOutlined' },
 ],
 },
 ]
 }, [])

 const renderIcon = React.useCallback(({ component: Component, tagName }) => {
 return (
 <div
 key={tagName}
 style={{
 display: 'flex',
 flexDirection: 'column',
 alignItems: 'center',
 justifyContent: 'center',
 padding: '16px 0',
 borderRadius: '8px',
 }}
 onMouseEnter={(evt) => {
 evt.currentTarget.style.backgroundColor = '#f2f4f7'
 evt.currentTarget.style.cursor = 'pointer'
 }}
 onMouseLeave={(evt) => {
 evt.currentTarget.style.backgroundColor = 'transparent'
 evt.currentTarget.style.cursor = 'default'
 }}
 onClick={() => {
 try {
 const textArea = document.createElement('textarea')
 textArea.value = `<${tagName} />`
 textArea.style.position = 'fixed'
 textArea.style.opacity = '0'
 document.body.appendChild(textArea)
 textArea.select()
 document.execCommand('copy')
 document.body.removeChild(textArea)
 message.open({
 title: `复制成功：\n<${tagName} />`,
 type: 'success',
 })
 } catch (err) {
 console.error('复制失败:', err)
 message.open({
 title: '复制失败',
 type: 'error',
 })
 }
 }}
 >
 <Component style={{ fontSize: '32px' }} />
 <div style={{ marginTop: '16px', fontSize: '12px' }}>{tagName}</div>
 </div>
 )
 }, [])

 return (
 <> 
 <div className="icons-data__wrap">
 {icons.map((typeItem) => (
 <React.Fragment key={typeItem.id}>
 <div style={{ lineHeight: '22px', fontSize: '16px', margin: '8px 0' }}>
 {typeItem.title}
 </div>
 <div
 style={{
 display: 'grid',
 gap: 2,
 gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
 }}
 >
 {typeItem.children.map(renderIcon)}
 </div>
 </React.Fragment>
 ))}
 </div>
 </>
 )
}

```


## Props

### IconProps

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---- | --------------------- | ------ | ------ | ------ |
| size | 设置 Icon 的 尺寸大小 | number | - | - |
