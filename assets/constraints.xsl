<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html"/>
	<xsl:param name="language"/>
	<xsl:template match="html">
		<xsl:for-each select="body/h1[a]">
			<div class="modal" tabindex="-1" role="dialog" data-keyboard="false">
				<xsl:if test="substring(normalize-space(.),1,4)='RULE'">
					<xsl:attribute name="id"><xsl:value-of select="normalize-space(concat('RC_',substring-after(.,'RULE ')))"/></xsl:attribute>
					<div class="modal-dialog modal-lg" role="document">
						<div class="modal-content">
							<div class="modal-header">
								<h1 class="modal-title">
									<xsl:value-of select="normalize-space(substring-after(.,'RULE '))"/>
								</h1>
							</div>
							<div class="modal-body">
								<pre>
								    <xsl:value-of select="following-sibling::*/tr/td[@class='description']"/>
								</pre>
							</div>
						</div>
					</div>
				</xsl:if>
				<xsl:if test="substring(normalize-space(.),1,4)='COND'">
					<xsl:attribute name="id"><xsl:value-of select="normalize-space(concat('RC_',substring-after(.,'CONDITION ')))"/></xsl:attribute>
					<div class="modal-dialog modal-lg" role="document">
						<div class="modal-content">
							<div class="modal-header">
								<h1 class="modal-title">
									<xsl:value-of select="normalize-space(substring-after(.,'RULE '))"/>
								</h1>
							</div>
							<div class="modal-body">
								<pre>
								    <xsl:value-of select="following-sibling::*/tr/td[@class='description']"/>
								</pre>
							</div>
						</div>
					</div>
				</xsl:if>
			</div>
		</xsl:for-each>
	</xsl:template>
</xsl:stylesheet>
