<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html"/>
	<xsl:param name="language"/>
	<xsl:template match="/">
		<xsl:for-each select="CodeLists/CodeList[Identification='CL401']/CodeItem">
			<div class="modal fade" tabindex="-1" role="dialog" data-keyboard="false">
				<xsl:attribute name="id"><xsl:value-of select="concat('RC_',Code)"/></xsl:attribute>
				<div class="modal-dialog modal-lg" role="document">
					<div class="modal-content">
						<div class="modal-header">
							<h1 class="modal-title">
								<xsl:value-of select="Code"/>
							</h1>
						</div>
						<div class="modal-body">
							<p><xsl:value-of select="Name[@lang=($language)]"/></p>
						</div>
					</div>
				</div>
			</div>
		</xsl:for-each>
	</xsl:template>
</xsl:stylesheet>
