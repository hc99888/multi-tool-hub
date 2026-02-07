import { S3Storage } from 'coze-coding-dev-sdk';
import { readFileSync } from 'fs';

async function uploadBackup() {
  console.log('📦 开始上传备份文件...');

  // 初始化对象存储
  const storage = new S3Storage({
    endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL,
    bucketName: process.env.COZE_BUCKET_NAME,
    region: 'cn-beijing',
  });

  // 读取压缩文件
  const filePath = '/tmp/lyrics-analyzer-backup.tar.gz';
  const fileContent = readFileSync(filePath);

  console.log(`📁 文件大小: ${(fileContent.length / 1024).toFixed(2)} KB`);

  // 上传文件
  console.log('⬆️  正在上传到对象存储...');
  const fileKey = await storage.uploadFile({
    fileContent: fileContent,
    fileName: 'lyrics-analyzer-backup.tar.gz',
    contentType: 'application/gzip',
  });

  console.log(`✅ 上传成功！文件key: ${fileKey}`);

  // 生成下载链接（30天有效期）
  console.log('🔗 正在生成下载链接...');
  const downloadUrl = await storage.generatePresignedUrl({
    key: fileKey,
    expireTime: 30 * 24 * 60 * 60, // 30天
  });

  console.log('✅ 下载链接生成成功！');
  console.log('');
  console.log('==========================================');
  console.log('  📦 备份文件下载链接');
  console.log('==========================================');
  console.log('');
  console.log('文件名：lyrics-analyzer-backup.tar.gz');
  console.log(`文件大小：${(fileContent.length / 1024).toFixed(2)} KB`);
  console.log(`有效期：30天`);
  console.log('');
  console.log('下载地址：');
  console.log(downloadUrl);
  console.log('');
  console.log('==========================================');
  console.log('');
  console.log('💡 使用说明：');
  console.log('1. 点击上面的链接下载压缩包');
  console.log('2. 解压缩：tar -xzf lyrics-analyzer-backup.tar.gz');
  console.log('3. 进入项目目录：cd projects');
  console.log('4. 安装依赖：pnpm install');
  console.log('5. 启动开发：pnpm run dev');
  console.log('');
}

uploadBackup().catch((error) => {
  console.error('❌ 上传失败：', error);
  process.exit(1);
});
