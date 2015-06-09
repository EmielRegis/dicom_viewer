namespace DicomViewer.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class init : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Stickers",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        Title = c.String(),
                        Content = c.String(),
                        XPixelCoordinate = c.Int(nullable: false),
                        YPixelCoordinate = c.Int(nullable: false),
                        Author = c.String(),
                        DicomFilename = c.String(),
                        FrameNumber = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.Stickers");
        }
    }
}
